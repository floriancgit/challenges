var config = require('./config');

module.exports = {
  get: async function (url) {
    console.log('functions | get URL ', url);
    const opts = {
        headers: {
            cookie: config.COOKIE_KEY + '=' + config.COOKIE_VAL,
        }
    };
    const result = await fetch(url, opts);
  },
};
