const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const webpackTool = require('webpack-tool');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const nodeExternals = require('webpack-node-externals');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

class WebpackConfig {
  constructor(options = {}) {
    options = Object.assign(
      {
        target: 'web',
        env: 'dev',
      },
      options
    );

    const isServer = this.isServer = options.target === 'node';
    const isProd =  this.isProd = options.env === 'prod';
    const output = isServer ? './server' : './dist';

    this.config = {
      entry: {
        include: [
          './src/page/**/index.js',
          '!./src/page/**/component/**',
        ],
      },
      output: {
        path: path.join(__dirname, output),
        filename: `js/[name]${ isProd && !isServer ? '.[chunkhash:8]' : ''}.js`,
        publicPath: '/',
      },
      devtool: 'source-map',
      devServer: {
        contentBase: output,
        hot: true,
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
              use: [ 'css-loader', 'sass-loader' ],
            }),
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: `img/[name].[hash:8].[ext]`
              },
            }
          },
        ],
      },
      plugins: [
        new CleanWebpackPlugin([ output ]),
        // new UglifyJSPlugin(),
        new HotModuleReplacementPlugin(),
        new WebpackMd5Hash(),
        new CommonsChunkPlugin({
          name: 'common',
        }),
        new ExtractTextPlugin(`css/[name]${ isProd ? '.[contenthash:8]' : ''}.css`),
      ]
    };

    this.initConfig();
  }

  initConfig() {
    this.setEntry();
    this.setDevTool();
    this.setCommonsChunk();
    this.setTarget();
    this.setHTMLPlugin();
  }

  setEntry() {
    const entry = {};
    glob.sync(this.config.entry.include).forEach(item => {
      const name = item.replace(/^(\.?\/)?src\/page\//, '').replace(/\/[^\/]*$/, '');
      if (this.isServer) {
        entry[name] = [ item ];
      } else {
        entry[name] = [ 'webpack-hot-middleware/client', item ];
      }
    });
    this.config.entry = entry;
  }

  setDevTool() {
    const { config } = this;
    if (this.isProd) {
      config.devtool = undefined;
      config.devServer = undefined;
    }
    if (this.isProd || this.isServer) {
      for (let i = 0; i < config.plugins.length; i++) {
        const plugin = config.plugins[i];
        if (plugin instanceof HotModuleReplacementPlugin) {
          config.plugins.splice(i, 1);
        }
      }
    }
  }

  setCommonsChunk() {
    const { config } = this;
    if (this.isServer) {
      for (let i = 0; i < config.plugins.length; i++) {
        const plugin = config.plugins[i];
        if (plugin instanceof CommonsChunkPlugin) {
          config.plugins.splice(i, 1);
        }
      }
    }
  }

  setTarget() {
    if (this.isServer) {
      this.config = webpackTool.merge(this.config, {
        target: 'node',
        externals: [ nodeExternals() ],
        output: {
          libraryTarget: 'commonjs2',
        },
      });
    }
  }

  setHTMLPlugin() {
    const { config } = this;

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
  }
}

module.exports = [
  new WebpackConfig().config,
  new WebpackConfig({ target: 'node' }).config,
];
