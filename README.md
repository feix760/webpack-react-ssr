
# webpack-react-ssr

## Script description

| Script  | Description |
|---|---|
| npm run start | Start development build and server. App on http://127.0.0.1:3000/html/index.html |
| npm run build | Build production and output files to `dist` & `server` directories |
| npm run start-prod | Start production server. Needed run build first |
| npm run lint | Run eslint check |
| npm run fix | Run eslint check with `--fix` option |

## Dependencies install

### Install PhantomJS

We use [postcss-sprites](https://github.com/2createStudio/postcss-sprites) to generate sprites, it dependency on `PhantomJS`

PhantomJS download: http://phantomjs.org/download.html

Download the executable file for your os and put it to the `$PATH`

### Install node_modules

```sh
npm install
```

## Page component exports

Page component example: [src/page/index/index.js](./src/page/index/index.js)

### store:createStore() `optional`

Create redux store

### promise:fetchStore(store) `optional`

Fetch store on server/client

### element:createElement(store)

Create React element
