const express = require('express');

const app = express();

if (process.env.NODE_ENV === 'production') {
  require('./app/production')(app);
} else {
  require('./app/dev')(app);
}

// Serve the files on port 3000.
app.listen(3000, function() {
  console.log('App on http://127.0.0.1:3000/\n');
});
