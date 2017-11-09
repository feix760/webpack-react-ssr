const express = require('express');

const app = express();

if (process.env.NODE_ENV === 'production') {
  require('./app/production')(app);
} else {
  require('./app/dev')(app);
}

const port = 3000;
// Serve the files on port 3000.
app.listen(port, function() {
  console.log(`\nApp on http://127.0.0.1:${port}/\n`);
  if (process.env.NODE_ENV !== 'production') {
    require('openurl').open(`http://127.0.0.1:${port}/html/index.html`);
  }
});
