var moment = require('moment');
module.exports = function (app) {
  // const dbPath = app.get('nedb');
  const mongooseClient = app.get('mongooseClient');

  const feed = new mongooseClient.Schema({
    feedUrl: {type: String,unique: true},
    feedName: {type: String},
    statusCode: {type: Number ,default: 0},
    avatar: {type: String},
    tag: {type: String, default:"rss"},
    delay: {type: Number,default: 30},
    trending: {type: Boolean,default: true},
    userId: {type: String},
    followersCount: {type: Number,default:0},
    createdAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updatedAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });
  return mongooseClient.model('feed', feed);
  };
