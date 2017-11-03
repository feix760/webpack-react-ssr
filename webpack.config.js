const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const webpackTool = require('webpack-tool');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const nodeExternals = require('webpack-node-externals');
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
      publicPath: '/',
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
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isProduction,
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
        filename: `html/${chunk}.html`,
        template: entry.replace(/\.js$/, '.html'),
        chunks: commonsChunk.concat([ chunk ]),
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

  setEntry();
  setCommonsChunk();
  setHTMLPlugin();
  setUglify();
  setTarget();
  setDevTool();

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
