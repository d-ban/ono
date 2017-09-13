// Initializes the `myfeeds` service on path `/myfeeds`
const createService = require('feathers-mongoose');
const createModel = require('../../models/myfeeds.model');
const hooks = require('./myfeeds.hooks');
const filters = require('./myfeeds.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'myfeeds',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/myfeeds', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('myfeeds');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
