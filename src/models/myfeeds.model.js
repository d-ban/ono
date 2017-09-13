var moment = require('moment');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const myfeeds = new Schema({
    // feedUrl: { type: String},
    // {feedUrl: 1, userId: 1}, {unique: true}
    feedId: { type: String},
    userId: {type: String},
    follow: {type: Boolean},
    createdAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updatedAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });
  myfeeds.index({feedId: 1, userId: 1}, {unique: true});

  return mongooseClient.model('myfeeds', myfeeds);
};
