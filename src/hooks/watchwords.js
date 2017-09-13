// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
let cache = []
let timer
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    let id = hook.result._id
    let title = hook.data.title.toLowerCase()
    let boostedByfav =hook.result.boost


    hook.app.service('watchword').find({
      query:{
        $sort: {
          createdAt: -1
        },
      }
    }).then((watchwords)=>{
      for (var i = 0; i < watchwords.data.length; i++) {
        if (title.search(watchwords.data[i].word.toLowerCase()) > -1) {
          let boost=boostedByfav+100
          hook.app.service('mystream').patch(id, { boost: boost,alert:1 })
        }
      }
    });

    return Promise.resolve(hook);
  };
};
