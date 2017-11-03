const express = require('express');
const productionApp = require('./app/production');
const devApp = require('./app/dev');

const app = express();

if (process.env.NODE_ENV === 'production') {
  productionApp(app);
} else {
  devApp(app);
}

// Serve the files on port 3000.
app.listen(3000, function() {
  console.log('Example app listening on port 3000!\n');
});
