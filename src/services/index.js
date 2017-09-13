const note = require('./note/note.service.js');
const feed = require('./feed/feed.service.js');
const feedstore = require('./feedstore/feedstore.service.js');
const trending = require('./trending/trending.service.js');
const stopwords = require('./stopwords/stopwords.service.js');
const watchword = require('./watchword/watchword.service.js');
const users = require('./users/users.service.js');
const myfeeds = require('./myfeeds/myfeeds.service.js');
const following = require('./following/following.service.js');
const mystream = require('./mystream/mystream.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(note);
  app.configure(feed);
  app.configure(feedstore);
  app.configure(trending);
  app.configure(stopwords);
  app.configure(watchword);
  app.configure(users);
  app.configure(myfeeds);
  app.configure(following);
  app.configure(mystream);
};
