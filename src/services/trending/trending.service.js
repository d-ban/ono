// Initializes the `trending` service on path `/trending`
const createService = require('feathers-mongoose');
const createModel = require('../../models/trending.model');
const hooks = require('./trending.hooks');
const filters = require('./trending.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'trending',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/trending', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('trending');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
