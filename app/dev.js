
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const renderMiddleware = require('./renderMiddleware');

module.exports = (app, { port }) => {
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

  compiler.plugin('done', () => setTimeout(() => {
    console.log(chalk.green(`index page: http://127.0.0.1:${port}/html/index.html`));
  }, 20));
};
