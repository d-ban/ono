// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment');
var FeedParser = require('feedparser');
var request = require('request');
var sanitizeHtml = require('sanitize-html');
var parseFavicon = require('parse-favicon');
var axios = require('axios');
var urlapi = require('url');
let geMeAIcon

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    console.log("feedAfter.js");

    function getIcon(forUrl,id){
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) \
            AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 \
            Safari/537.36'
    }
    axios.get(forUrl,headers)
    .then(({ data: html }) => parseFavicon.parseFavicon(html, { baseURI: forUrl, allowUseNetwork: true, allowParseImage: false }))
    .then((myIcon)=>{
      // console.log(myIcon);
      function sortNumber(a,b) {
        return a - b;
      }
      let sizes = []
      for (var i = 0; i < myIcon.length; i++) {
        if (myIcon[i].size) {
          let size = myIcon[i].size.split("x");
          sizes.push(size[0])
        }else if (myIcon.length>0 && sizes.length===0 && myIcon[0].url) {
          hook.app.service('feed').patch(id, { avatar: myIcon[0].url })
        }
      }
      let sorted = sizes.sort(sortNumber).reverse()
      for (var i = 0; i < myIcon.length; i++) {
        if (myIcon[i].size) {
        let size = myIcon[i].size.split("x");
        if (size[0]===sorted[0]) {
          if (myIcon[i].url) {
            hook.app.service('feed').patch(id, { avatar: myIcon[i].url })
          }

        }
      }
      }

    }).catch(error_1 => {
      console.log("error_1 run with true");
    })
    }
    var req = request(hook.result.feedUrl)

    var feedparser = new FeedParser([]);


    req.on('error', function (error) {
      // handle any request errors
    });

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream
      // console.log(stream);
      hook.app.service('feed').patch(hook.result._id, { statusCode: parseInt(res.statusCode, 10) })
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

      // getIcon()
      clearTimeout(geMeAIcon)
      geMeAIcon = setTimeout(function() {
        if (meta.title) {
          hook.app.service('feed').patch(hook.result._id, { feedName: meta.title })
        }
        if (meta.link) {
          hook.app.service('feed').patch(hook.result._id, { originLink: meta.link })
        }else {
          console.log("no link get base");
        }
        console.log("meta link",meta.link,hook.result._id);
        let img = '/rss.png'

        if (meta.favicon) {
          console.log("favicon");
          img = meta.favicon
          img = img.replace(/\/$/, ""); // redditicon fix
          hook.app.service('feed').patch(hook.result._id, { avatar: img })
        }else if (meta.image.url) {
            console.log("image");
          img = meta.image.url
          console.log(img);
          hook.app.service('feed').patch(hook.result._id, { avatar: img })
        }else if (meta.link){
          console.log("getIcon",meta.link,urlapi.parse(meta.link).protocol);
          let newUrl=urlapi.parse(meta.link).protocol+"//"+urlapi.parse(meta.link).hostname
          getIcon(newUrl,hook.result._id)
        }else {
          let newUrl=urlapi.parse(hook.result.feedUrl).protocol+"//"+urlapi.parse(hook.result.feedUrl).hostname
          getIcon(newUrl,hook.result._id)
        }

      }, 100)






      var item;
      let feedData=[]
    //   while (item = stream.read()) {
    //     let lfRespo = {}
    //     lfRespo.title= item.title
    //     lfRespo.description= sanitizeHtml(item.description, {allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])  })
    //     lfRespo.link= item.link
    //     lfRespo.date= item.date
    //     lfRespo.tag= "rss"
    //     lfRespo.feedUrl= hook.result.feedUrl
    //     lfRespo.feedId= hook.result._id
    //     lfRespo.createdAt= moment().format('YYYY-MM-DD HH:mm:ss')
    //     feedData.push(lfRespo)
    // //     Promise.all([
    // //       hook.app.service('feedstore').create(lfRespo)
    // //     ]).then(([feedstoreRespo]) => {
    // //       // console.log("feedstoreRespo");
    // //     }).catch(error2 => {
    // //   console.log("error2")
    // // })
    // }

    })

    return Promise.resolve(hook);
  };
};
