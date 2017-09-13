// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
let cache = []
let timer
// console.log("ij");
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    let id = hook.result._id
    let boostByFav = hook.result.boost
    let title = hook.data.title.toLowerCase()

    // console.log("trending words hook for");

      hook.app.service('trending').find({
        query:{
          $sort: {
            createdAt: -1
          },
          $limit: 10,
        }
      }).then((trendingwords)=>{
        let uniq = []
        let trendingData = []
        for (var i = 0; i < trendingwords.data.length; i++) {
          if (uniq.indexOf(trendingwords.data[i].word) === -1) {
            uniq.push(trendingwords.data[i].word)
            trendingData.push(trendingwords.data[i])
          }
        }
        cache=trendingData
        for (var i = 0; i < trendingData.length; i++) {
          if (title.search(trendingData[i].word.toLowerCase()) > -1) {
            // console.log("match fresh",trendingData[i].word);
            // console.log("patch boost trending",trendingData[i].count);
            let boost=trendingData[i].count+boostByFav
            // console.log("mystream patch");
            hook.app.service('mystream').patch(id, { boost: boost,tag:trendingData[i].word,trending:1 })
          }
        }
      });
    // }



    return Promise.resolve(hook);
  };


};
