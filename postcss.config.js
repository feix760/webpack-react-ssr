
const md5 = require('md5');

/**
 * Only for sprites
 */
module.exports = {
  plugins: [
    require('postcss-sprites')({
      spritePath: './dist/sprites.tmp/',
      retina: true,
      spritesmith: {
        padding: 10,
      },
      groupBy(img) {
        const name = md5(img.styleFilePath.replace(__dirname, '')).slice(0, 8);
        return Promise.resolve(name);
      },
      filterBy(img) {
        if (img.originalUrl.match(/[?&]__sprite/)) {
          return Promise.resolve();
        }
        return Promise.reject();
      },
    }),
  ],
};
