
const path = require('path');
const fs = require('fs');
const domain = require('domain');
const ReactDOM = require('react-dom/server');
const util = require('./util');
const Window = require('./window');

module.exports = (req, res, next) => {
  require('./defineGlobalProperties');

  const { filename, fileSystem } = req;
  const cwd = process.cwd();

  // TODO use fs async method
  if (!req.query._clientRender && fileSystem.existsSync(filename)) {

    const chunk = filename.replace(cwd, '')
      .replace(/^[\/\\]?[^\/\\]*[\/\\]html[\/\\]/, '')
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
      // static middleware will send the html of client render
      next();
    });
    // while run server render also can use `location.href|document.cookie` to get request info
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
              `<script> window.__initialState = ${util.escapeHTML(JSON.stringify(state))}</script>`
            );
          res.end(body);
        });
    });
  } else {
    next();
  }
};
