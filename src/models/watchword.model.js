module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');

  const watchword = new mongooseClient.Schema({
    word: {type: String,unique: true},
    createdAt: { type: String},
    updatedAt: { type: String}
  });
  return mongooseClient.model('watchword', watchword);
  };
