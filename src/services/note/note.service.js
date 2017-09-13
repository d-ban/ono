// Initializes the `note` service on path `/note`
const createService = require('feathers-nedb');
const createModel = require('../../models/note.model');
const hooks = require('./note.hooks');
const filters = require('./note.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'note',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/note', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('note');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
