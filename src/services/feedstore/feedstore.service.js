// Initializes the `feedstore` service on path `/feedstore`
const createService = require('feathers-mongoose');
const createModel = require('../../models/feedstore.model');
const hooks = require('./feedstore.hooks');
const filters = require('./feedstore.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'feedstore',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/feedstore', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('feedstore');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
