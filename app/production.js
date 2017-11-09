
const fs = require('fs');
const path = require('path');
const express = require('express');
const renderMiddleware = require('./renderMiddleware');

module.exports = app => {
  const cwd = process.cwd();

  app.use('/*.html', (req, res, next) => {
    req.filename = path.join(cwd, 'dist', req.originalUrl.replace(/\?.*$/, ''));
    // TODO load all html to an memory file system
    req.fileSystem = fs;

    next();
  });

  app.use('/*.html', renderMiddleware);

  app.use('/', express.static(path.join(cwd, 'dist')));
};
