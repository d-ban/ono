

const feed = require('../../hooks/feed');
const feedAfter = require('../../hooks/feedAfter');
const feedRemoved = require('../../hooks/feedRemoved');
const feedparser = require('../../hooks/feedparser');
const doIfollow = require('../../hooks/doIfollow');
const doIfollowGet = require('../../hooks/doIfollowGet');
const feedTranslateRequest = require('../../hooks/feedTranslateRequest');
const {restrictToOwner,associateCurrentUser} = require('feathers-authentication-hooks');

const {authenticate } = require('feathers-authentication').hooks;
const {populate} = require('feathers-hooks-common');

const followingSchema = {
  include: {
    service: 'myfeeds',
    nameAs: 'feed',
    parentField: '_id',
    childField: 'feedId'
  }
};
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: 'userId'
  })
];

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [feedTranslateRequest()],
    get: [],
    create: [feed()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [doIfollow()],
    get: [],
    create: [feedAfter()],
    update: [],
    patch: [feedparser()],
    remove: [feedRemoved()]
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
