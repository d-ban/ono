// Initializes the `feed` service on path `/feed`
const createService = require('feathers-mongoose');
const createModel = require('../../models/feed.model');
const hooks = require('./feed.hooks');
const filters = require('./feed.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'feed',
    Model,
    paginate: {
  default: 1000,
  max: 1000
  }
  };

  // Initialize our service with any options it requires
  app.use('/feed', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('feed');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
