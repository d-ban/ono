// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

if (!hook.params.query._id && hook.result.data.length!=0){
  let merge = []
  const mapMe = new Promise((resolve, reject) => {

    function mapMe(itemId,position){
      hook.app.service('mystream').find({query:{itemId:itemId}}).then((feedstore)=>{
        if (feedstore.data[0]) {
          hook.result.data[position]._id=feedstore.data[0]._id
          hook.result.data[position].fav=feedstore.data[0].fav
          hook.result.data[position].boost=feedstore.data[0].boost
        }
        merge.push(1)
        if (merge.length===hook.result.data.length) {
          resolve(hook.result.data);
          }
      })
    }
    for (var i = 0; i < hook.result.data.length; i++) {
      mapMe(hook.result.data[i]._id,i)
    }

    })

      return mapMe.then(lfRespo => {
        return (hook);
      })
  }
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook);
  };
};
