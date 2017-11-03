
const renderMiddleware = require('./renderMiddleware');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');

module.exports = app => {
  const compiler = webpack(config);

  const webpackDevMiddleware = WebpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: { colors: true },
  });

  app.use('/*.html', (req, res, next) => {
    req.filename = webpackDevMiddleware.getFilenameFromUrl(req.originalUrl.replace(/\?.*$/, ''));
    req.fileSystem = webpackDevMiddleware.fileSystem;
    next();
  });

  app.use('/*.html', renderMiddleware);

  app.use(webpackDevMiddleware);

  app.use(WebpackHotMiddleware(compiler.compilers[0]));
};
