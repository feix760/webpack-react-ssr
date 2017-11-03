
const path = require('path');
const fs = require('fs');
const ReactDOM = require('react-dom/server');
const requireFromString = require('require-from-string');

const escapeHTML = html => html.replace(/</g, '\\u003c');

module.exports = (req, res, next) => {
  const { filename, fileSystem } = req;
  const cwd = process.cwd();

  if (req.query['__serverRender'] !== 'false' && fileSystem.existsSync(filename)) {
    const chunk = filename.replace(cwd, '')
      .replace(/^\/?[^\/]*\/html\//, '')
      .replace(/\.html$/, '.js');

    const chunkfile = path.join(cwd, 'server/js', chunk);

    let Component;
    if (fileSystem === fs) {
      Component = require(chunkfile);
    } else {
      const code = fileSystem.readFileSync(chunkfile).toString();
      Component = requireFromString(code, chunkfile);
    }

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
  } else {
    next();
  }
};
