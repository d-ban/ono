// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment');
var FeedParser = require('feedparser');
var request = require('request');
var sanitizeHtml = require('sanitize-html');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    console.log("paevo");
    //  process.stdout.write('\033c');

    if (!hook.data.statusCode  && !hook.data.originLink && !hook.data.feedName && !hook.data.avatar  && !hook.data.delay && !hook.data.trending && hook.result._id && hook.data.followersCount === undefined) {
      console.log("get feeds",hook.data.followersCount);
    let feedUrl = hook.result.feedUrl
    let feedId = hook.result._id
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<",feedId);
    var req = request(feedUrl)
    // var req = request('http://partis.si/partis/feed')
    var feedparser = new FeedParser([]);


    req.on('error', function (error) {
      // handle any request errors
    });

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream
      // console.log(stream); %Y-%m-%dT%H:%M:%S.%fZ
      console.log("mene patch(feedId, {statusCode: res.statusCode})");
      hook.app.service('feed').patch(feedId, {statusCode: res.statusCode,updatedAt:moment().format('YYYY-MM-DD HH:mm:ss')})

      if (res.statusCode !== 200) {
        console.log(res.statusCode);
      }
      else {
        stream.pipe(feedparser);
      }
    });

    feedparser.on('error', function (error) {
      // always handle errors
    });
    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance

      // if (meta.title) {
      //   hook.app.service('feed').patch(hook.result._id, { feedName: meta.title })
      // }

      var item;
      let feedData=[]
      while (item = stream.read()) {
        // console.log(item.date);
        // console.log(item.categories);
        let desc =""
        if (item.description) {
          desc = sanitizeHtml(item.description, {allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])  })
        }
        let lfRespo = {}
        lfRespo.title= item.title
        lfRespo.description= desc
        lfRespo.link= item.link
        lfRespo.createdAt= moment().format('YYYY-MM-DD HH:mm:ss')
        lfRespo.updatedAt= moment().format('YYYY-MM-DD HH:mm:ss')
        lfRespo.tag= "rss"
        lfRespo.feedId= feedId
        // lfRespo.feedUrl= feedUrl
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
  }
    return Promise.resolve(hook);
  };
};
