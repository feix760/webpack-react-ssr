const path = require('path');
const express = require('express');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const requireFromString = require('require-from-string');
const ReactDOM = require('react-dom/server');
const config = require('./webpack.config.js');

const app = express();
const compiler = webpack(config);

const webpackDevMiddleware = WebpackDevMiddleware(compiler, {
  publicPath: '/',
  stats: { colors: true },
});

app.use((req, res, next) => {
  const filename = webpackDevMiddleware.getFilenameFromUrl(req.url);
  const fileSystem = webpackDevMiddleware.fileSystem;

  if (filename.match(/\.html$/) && fileSystem.existsSync(filename)) {
    const chunk = filename.replace(__dirname, '')
      .replace(/^\/?[^\/]*\/html\//, '')
      .replace(/\.html$/, '.js');

    const chunkfile = path.join(__dirname, 'server/js', chunk);

    const js = fileSystem.readFileSync(chunkfile).toString();
    const template = fileSystem.readFileSync(filename).toString();

    const Component = requireFromString(js, chunkfile);

    const store = Component.createStore && Component.createStore();

    (Component.fetchStore ? Component.fetchStore(store) : Promise.resolve())
      .then(() => {
        const element = Component.createElement(store);

        const html = ReactDOM.renderToString(element);
        const state = store && store.getState() || {};

        const body = template.replace(/<!--\s*__initialHTML\s*-->/, html)
          .replace(
            /<!--\s*__initialState\s*-->/,
            `<script> window.__initialState = ${JSON.stringify(state).replace(/</g, '&lt')}</script>`
          );
        res.end(body);
      });
  } else {
    next();
  }
});

app.use(webpackDevMiddleware);

app.use(WebpackHotMiddleware(compiler.compilers[0]));

// Serve the files on port 3000.
app.listen(3000, function() {
  console.log('Example app listening on port 3000!\n');
});
