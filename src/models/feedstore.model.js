var moment = require('moment');
console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const feedstore = new Schema({
    link: { type: String ,unique: true},
    title: { type: String},
    description: { type: String},
    feedId: { type: String},
    userId: {type: String},
    createdAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updatedAt: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });
  feedstore.index({title: 'text'});

  return mongooseClient.model('feedstore', feedstore);
};
