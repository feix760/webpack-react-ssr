
const requireFromString = require('require-from-string');

const requireFromStringCache = {};

exports.requireFromString = (code, path) => {
  const cache = requireFromStringCache[path];
  if (cache && cache.code === code) {
    return cache.obj;
  }
  const obj = requireFromString(code, path);
  requireFromStringCache[path] = {
    code,
    obj,
  };
  return obj;
};

exports.escapeHTML = html => html.replace(/</g, '\\x3C');
