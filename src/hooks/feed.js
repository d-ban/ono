// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // if (!hook.data.delay) {
    //   hook.data.delay=30
    // }
    // if (!hook.data.tag) {
    //   hook.data.tag="rss"
    // }
    // hook.data.createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

    hook.data.feedUrl = hook.data.feedUrl.trim()
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook);
  };
};
