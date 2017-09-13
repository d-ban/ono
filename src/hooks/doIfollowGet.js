// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
if (hook.result._id){
  process.stdout.write('\033c');
  console.log("doi");
  console.log(hook);
  console.log(hook.result._id);
  const doIfollow = new Promise((resolve, reject) => {

    function doIfollow(feedId){

      hook.app.service('myfeeds').find({query:{feedId:feedId,userId:hook.params.user._id}}).then((count)=>{
        if (count.total>0) {
          hook.result.following=true
        }
        resolve(hook.result.data);
      })
    }


      doIfollow(hook.result._id)


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
