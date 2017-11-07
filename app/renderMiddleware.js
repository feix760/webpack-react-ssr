
const path = require('path');
const fs = require('fs');
const domain = require('domain');
const ReactDOM = require('react-dom/server');
const util = require('./util');
const Window = require('./window');

const escapeHTML = html => html.replace(/</g, '\\x3C');

Object.defineProperties(global, {
  window: {
    get() {
      return process.domain && process.domain.window || undefined;
    },
  },
  document: {
    get() {
      return process.domain && process.domain.window.document || undefined;
    },
  },
  navigator: {
    get() {
      return process.domain && process.domain.window.navigator || undefined;
    },
  },
  location: {
    get() {
      return process.domain && process.domain.window.location || undefined;
    },
  },
});

module.exports = (req, res, next) => {
  const { filename, fileSystem } = req;
  const cwd = process.cwd();

  if (!req.query._clientRender && fileSystem.existsSync(filename)) {

    const chunk = filename.replace(cwd, '')
      .replace(/^\/?[^\/]*\/html\//, '')
      .replace(/\.html$/, '.js');

    const chunkfile = path.join(cwd, 'server/js', chunk);

    let Component;
    if (fileSystem === fs) {
      Component = require(chunkfile);
    } else {
      const code = fileSystem.readFileSync(chunkfile).toString();
      Component = util.requireFromString(code, chunkfile);
    }

    const d = domain.create();
    d.on('error', err => {
      console.error('Caught error!', err);
      next();
    });
    d.window = new Window(req);
    d.run(() => {
      const store = Component.createStore && Component.createStore();

      (Component.fetchStore ? Component.fetchStore(store) : Promise.resolve())
        .then(() => {
          const element = Component.createElement(store);

          const html = ReactDOM.renderToString(element);
          const state = store && store.getState() || {};

          const template = fileSystem.readFileSync(filename).toString();
          const body = template.replace(/<!--\s*__initialHTML\s*-->/, html)
            .replace(
              /<!--\s*__initialState\s*-->/,
              `<script> window.__initialState = ${escapeHTML(JSON.stringify(state))}</script>`
            );
          res.end(body);
        });
    });
  } else {
    next();
  }
};
