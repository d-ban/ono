// Initializes the `watchword` service on path `/watchword`
const createService = require('feathers-mongoose');
const createModel = require('../../models/watchword.model');
const hooks = require('./watchword.hooks');
const filters = require('./watchword.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'watchword',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/watchword', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('watchword');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
