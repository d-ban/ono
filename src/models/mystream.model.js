var moment = require('moment');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const mystream = new Schema({
    itemId: { type: String,required: true},
    feedId: { type: String,required: true},
    userId: {type: String},
    boost: {type: Number, default:0},
    readCount: {type: Number, default:0},
    fav: {type: Number, default:0},
    alert: {type: Number, default:0},
    trending: {type: Number,default:0},
    tag: {type: String,default:"rss"},
    createdAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updatedAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });
  mystream.index({itemId: 1, userId: 1}, {unique: true});
  return mongooseClient.model('mystream', mystream);
};
