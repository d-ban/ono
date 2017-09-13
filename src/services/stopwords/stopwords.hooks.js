const createdAt = require('../../hooks/createdAt');


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createdAt()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
