module.exports = function (app) {
  // const dbPath = app.get('nedb');
  const mongooseClient = app.get('mongooseClient');

  const stopwords = new mongooseClient.Schema({
    word: {type: String,unique: true},
    createdAt: { type: String},
    updatedAt: { type: String}
  });
  return mongooseClient.model('stopwords', stopwords);
  };
