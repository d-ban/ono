// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if (hook.params.query.trending) {
      hook.params.query.trending = (hook.params.query.trending === 'true');
    }
    if (hook.params.query.readCount == parseInt(hook.params.query.readCount, 10)) {
      console.log("samo broj");
      hook.params.query.readCount = parseInt(hook.params.query.readCount);
    }
    if (hook.params.query.fav == parseInt(hook.params.query.fav, 10)) {
      console.log("samo broj");
      hook.params.query.fav = parseInt(hook.params.query.fav);
    }
    if (hook.params.query.trendingTitle == parseInt(hook.params.query.trendingTitle, 10)) {
      console.log("samo broj");
      hook.params.query.trendingTitle = parseInt(hook.params.query.trendingTitle);
    }

    return Promise.resolve(hook);
  };
};
