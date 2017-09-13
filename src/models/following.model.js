var moment = require('moment');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const following = new Schema({
    feedId: { type: String,required: true},
    userId: {type: String},
    fav: {type: Boolean},
    boost: {type: Number},
    alert: {type: Number},
    trending: {type: Boolean},
    createdAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updatedAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });

  return mongooseClient.model('following', following);
};
