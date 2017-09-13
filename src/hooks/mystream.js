// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

if (!hook.params.query._id && hook.result.data.length!=0){
  let merge = []
  const mapMe = new Promise((resolve, reject) => {

    function mapMe(itemId,position){

      hook.app.service('feedstore').get(itemId).then((feedstore)=>{
        if (feedstore._id) {
          hook.result.data[position].title=feedstore.title
          hook.result.data[position].description=feedstore.description
          hook.result.data[position].link=feedstore.link
          hook.result.data[position].feedId=feedstore.feedId
          // hook.result.data[position].createdAt=feedstore.createdAt
        }
        merge.push(1)
        if (merge.length===hook.result.data.length) {
          resolve(hook.result.data);
          }
      })
    }

    for (var i = 0; i < hook.result.data.length; i++) {
      mapMe(hook.result.data[i].itemId,i)
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
