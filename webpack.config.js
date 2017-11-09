const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const webpackTool = require('webpack-tool');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const UglifyJSPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const getWebpackConfig = options => {
  options = options || {};
  const isServer = options.target === 'node';
  const isProduction = options.env === 'production';
  const output = isServer ? './server' : './dist';

  let config = {
    entry: {
      include: [
        './src/page/**/index.js',
        '!./src/page/**/component/**',
      ],
    },
    output: {
      path: path.join(__dirname, output),
      filename: `js/[name]${isProduction && !isServer ? '.[chunkhash:8]' : ''}.js`,
      publicPath: isProduction ? '//127.0.0.1/' : '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                interpolate: 1,
                attrs: [ ':src' ],
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isProduction && !isServer,
                },
              },
              {
                loader: 'autoprefixer-loader',
              },
              'sass-loader',
            ],
          }),
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin([ output ]),
      new WebpackMd5Hash(),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        DEBUG: false,
      }),
      new ProgressBarPlugin(),
      new HtmlWebpackInlineSourcePlugin(),
      new ExtractTextPlugin(`css/[name]${isProduction ? '.[contenthash:8]' : ''}.css`),
    ],
  };

  const setEntry = () => {
    const entry = {};
    glob.sync(config.entry.include).forEach(item => {
      const name = item.replace(/^(\.?\/)?src\/page\//, '').replace(/\/[^\/]*$/, '');
      if (isServer || isProduction) {
        entry[name] = [ item ];
      } else {
        entry[name] = [ 'webpack-hot-middleware/client', item ];
      }
    });
    config.entry = entry;
  };

  const setCommonsChunk = () => {
    if (!isServer) {
      config.plugins.push(new CommonsChunkPlugin({
        name: 'common',
      }));
    }
  };

  const setHTMLPlugin = () => {
    let commonsChunk = [];

    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin instanceof CommonsChunkPlugin) {
        commonsChunk = commonsChunk.concat(plugin.chunkNames);
      }
    }

    Object.keys(config.entry).forEach(chunk => {
      const entries = config.entry[chunk];
      const entry = entries instanceof Array ? entries[entries.length - 1] : entries;

      config.plugins.push(new HtmlWebpackPlugin({
        inlineSource: isProduction ? '\\.(css|\\inline\\.js)$' : undefined,
        filename: `html/${chunk}.html`,
        template: entry.replace(/\.js$/, '.html'),
        chunks: commonsChunk.concat([ chunk ]),
        minify: isProduction ? {
          minifyJS: true,
          minifyCSS: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
        } : false,
      }));
    });
  };

  const setUglify = () => {
    if (isProduction && !isServer) {
      config.plugins.push(new UglifyJSPlugin());
    }
  };

  const setTarget = () => {
    if (isServer) {
      config = webpackTool.merge(config, {
        target: 'node',
        externals: [ nodeExternals() ],
        output: {
          libraryTarget: 'commonjs2',
        },
      });
    }
  };

  const setDevTool = () => {
    if (!isProduction) {
      config.devtool = 'source-map';

      if (!isServer) {
        config.devServer = {
          contentBase: output,
          hot: true,
        };

        config.plugins.push(new HotModuleReplacementPlugin());
      }
    }
  };

  const setExternalAsset = () => {
    if (isProduction && !isServer) {
      config.plugins.push(new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'react',
            entry: 'https://unpkg.com/react@16.0.0/umd/react.production.min.js',
            global: 'React',
          },
          {
            module: 'react-dom',
            entry: 'https://unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js',
            global: 'ReactDOM',
          },
        ],
      }));
    }
  };

  setEntry();
  setCommonsChunk();
  setHTMLPlugin();
  setUglify();
  setTarget();
  setDevTool();
  setExternalAsset();

  return config;
};

module.exports = [
  getWebpackConfig({
    env: process.env.NODE_ENV,
  }),
  getWebpackConfig({
    env: process.env.NODE_ENV,
    target: 'node',
  }),
];
