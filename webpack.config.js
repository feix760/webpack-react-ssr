
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/page/index/index.js',
    list: './src/page/list/index.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].[hash:8].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
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
            name: 'img/[name].[hash:8].[ext]'
          },
        }
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist' ]),
    // new ManifestPlugin(),
    // new UglifyJSPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common' // Specify the common bundle's name.
    }),
    new HtmlWebpackPlugin({
      filename: 'html/index.html',
      template: './src/page/index/index.html',
      chunks: [ 'index', 'common' ],
    }),
    new HtmlWebpackPlugin({
      filename: 'html/list.html',
      template: './src/page/list/index.html',
      chunks: [ 'list', 'common' ],
    }),
    new ExtractTextPlugin('css/[name].[hash:8].css'),
    {
      apply(compiler) {
        compiler.plugin('compilation', compilation => {
          compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            // htmlPluginData.html += 'The magic footer';
            callback(null, htmlPluginData);
          });
        });
        compiler.plugin('emit', (compilation, callback) => {
          var allChunks = compilation.getStats().toJson().chunks;
          callback();
        });
      }
    }
  ]
};
