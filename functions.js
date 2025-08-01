var config = require('./config');

module.exports = {
  get: function (url) {
    console.log('functions | get URL ', url);
    const opts = {
        headers: {
            cookie: config.COOKIE_KEY + '=' + config.COOKIE_VAL,
        }
    };
    return fetch(url, opts);
  },
};
