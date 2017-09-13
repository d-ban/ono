// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var moment = require('moment');




module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    // const lfm = new Promise((resolve, reject) => {
    var req = request(hook.data.feedUrl)
    // var req = request('http://partis.si/partis/feed')
    var feedparser = new FeedParser([]);

    req.on('error', function (error) {
      // handle any request errors
    });

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream
      // console.log(stream);
      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
      }
      else {
        stream.pipe(feedparser);
      }
    });

    feedparser.on('error', function (error) {
      // always handle errors
    });
    let feedData=[]
    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance

      var item;
      while (item = stream.read()) {
        console.log(item);
        let lfRespo = {}
        lfRespo.title= item.title
        lfRespo.readCount= 0
        lfRespo.link= item.link
        lfRespo.description= item.description
        lfRespo.tag= "rss"
        lfRespo.feedUrl= hook.data.feedUrl
        lfRespo.createdAt= moment().format('YYYY-MM-DD HH:mm:ss')
        feedData.push(lfRespo)
        Promise.all([
          hook.app.service('feedstore').create(lfRespo)
        ]).then(([feedstoreRespo]) => {
          console.log("feedstoreRespo");
        }).catch(error2 => {
      console.log("error2")
    })

      }

    })
    // .on('end', function() {
    //                   resolve(feedData);
    //             });



    hook.app.service('feed').patch(null, { updatedAt: moment().format('YYYY-MM-DD HH:mm:ss') }, { query: { feedUrl: 'http://partissa.si/partis/feed' } })

    return Promise.resolve(hook);
  };
};
