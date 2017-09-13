// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

if (hook.result.data.length!=0){
  console.log("do i follow active");
  let merge = []
  const doIfollow = new Promise((resolve, reject) => {

    function doIfollow(feedId,updatedAt,position){

      hook.app.service('myfeeds').find({query:{feedId:feedId,userId:hook.params.user._id}}).then((count)=>{
        if (count.total>0) {
          hook.result.data[position].following=true
          hook.result.data[position].updatedAt=updatedAt
        }
        merge.push(1)
        if (merge.length===hook.result.data.length) {
          resolve(hook.result.data);
          }
      })
    }

    for (var i = 0; i < hook.result.data.length; i++) {
      doIfollow(hook.result.data[i]._id,hook.result.data[i].updatedAt,i)
    }

    })

      return doIfollow.then(lfRespo => {
        return (hook);
      })
  }
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook);
  };
};
