// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
let cacheBoost
let timer
let favTotal=1
let feedUrlCache = false
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    let id = hook.result._id
    let feedId = hook.result.feedId
    // let title = hook.data.title.toLowerCase()
    // let feedUrl = hook.result.feedUrl
    // console.log("hook.result",hook.result);

    // let boost = hook.result.boost
    // console.log("boost",boost);
    const countFav = new Promise((resolve, reject) => {

    hook.app.service('mystream').find({
      query:{
        feedId:feedId,
        fav: {
              $gte: 1
            },
        $limit: 0,
      }
    }).then((favorites)=>{
      favTotal=favorites.total
      // console.log("favTotal",favTotal);
      hook.app.service('mystream').patch(id, { boost:favTotal})
      resolve(favTotal);
    });

  })

  return countFav.then(countFavRespo => {
    // console.log("set first boost",countFavRespo);
    hook.result.boost=countFavRespo
    return (hook);
  })






  };
};
