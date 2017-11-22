const express = require('express');

const app = express();
const port = 3000;

if (process.env.NODE_ENV === 'production') {
  require('./app/production')(app, { port });
} else {
  require('./app/dev')(app, { port });
}

// Serve the files on port 3000.
app.listen(port, () => {
  // console.log(`\nApp on http://127.0.0.1:${port}/\n`);
});
