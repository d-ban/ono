// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    let removeFromMyFeedsId=hook.result._id
    console.log("remove from my feeds",removeFromMyFeedsId);
    hook.app.service('myfeeds').remove(null,{query:{feedId:removeFromMyFeedsId}})
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    // get all subscribers feedUrls
    return Promise.resolve(hook);
  };
};
