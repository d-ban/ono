var moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    // get all subscribers feedUrls
    // process.stdout.write('\033c');
    if (hook.result.feedId) {
      let feedId=hook.result.feedId
      let itemId=hook.result._id
      let title=hook.result.title
      let description=hook.result.description

      hook.app.service('myfeeds').find({
        query:{
          feedId:feedId
        }
      }).then((myFeeds)=>{
        if (myFeeds.total>0) {

          for (var i = 0; i < myFeeds.data.length; i++) {

            if (myFeeds.data[i].feedId===feedId) {
              console.log("ovaj feed prati ovaj korisnik",myFeeds.data[i].userId);
              let mystreamData={}
              mystreamData.itemId=itemId
              mystreamData.feedId=feedId
              mystreamData.userId=myFeeds.data[i].userId
              mystreamData.createdAt=moment().format('YYYY-MM-DD HH:mm:ss')
              mystreamData.updatedAt=moment().format('YYYY-MM-DD HH:mm:ss')
              // just for filtering not for storing>>>>>
              //  dont remove this !!!!!
              mystreamData.title=title
              mystreamData.description=description
              hook.app.service('mystream').create(mystreamData).then((mystreamCreated)=>{})

          }
          }

        }else {
          console.log("nitko ne prati");
        }

      });
    }

    return Promise.resolve(hook);
  };
};
