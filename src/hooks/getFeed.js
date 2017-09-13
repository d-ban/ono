var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    console.log(hook.result.data[0].feedUrl);
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook);
  };
};
