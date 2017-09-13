module.exports = function (app) {
  // const dbPath = app.get('nedb');
  const mongooseClient = app.get('mongooseClient');

  const trending = new mongooseClient.Schema({
    count: {type: Number},
    word: {type: String},
    createdAt: { type: String},
    updatedAt: { type: String}
  });
  return mongooseClient.model('trending', trending);
  };
