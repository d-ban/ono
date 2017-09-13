// Initializes the `mystream` service on path `/mystream`
const createService = require('feathers-mongoose');
const createModel = require('../../models/mystream.model');
const hooks = require('./mystream.hooks');
const filters = require('./mystream.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'mystream',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/mystream', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('mystream');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
