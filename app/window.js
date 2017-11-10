
const url = require('url');

class Document {
  constructor(req) {
    this.cookie = req.get('cookie') || '';
  }
}

class Location {
  constructor(req) {
    const href = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const attr = url.parse(href);

    Object.assign(this, attr);
  }
}

class Navigator {
  constructor(req) {
    this.userAgent = req.get('user-agent') || '';
  }
}

class Window {
  constructor(req) {
    this.document = new Document(req);
    this.location = new Location(req);
    this.navigator = new Navigator(req);
    // TODO create a fetch client with user's cookie & userAgent
    // this.fetch =
  }
}

module.exports = Window;
