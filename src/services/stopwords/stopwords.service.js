// Initializes the `stopwords` service on path `/stopwords`
const createService = require('feathers-mongoose');
const createModel = require('../../models/stopwords.model');
const hooks = require('./stopwords.hooks');
const filters = require('./stopwords.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'stopwords',
    Model,
    paginate: {
      default: 10,
      max: 10000
  }
  };

  // Initialize our service with any options it requires
  app.use('/stopwords', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('stopwords');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
