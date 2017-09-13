const { authenticate } = require('feathers-authentication').hooks;
const {queryWithCurrentUser,restrictToOwner,associateCurrentUser} = require('feathers-authentication-hooks');
const followersCount = require('../../hooks/followersCount');
const followersCountRemove = require('../../hooks/followersCountRemove');

const restrictAssociateCurrentUser = [
authenticate('jwt'),
associateCurrentUser({
    idField: '_id',
    as: 'userId'
  })
];

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: 'userId'
  })
];


const {populate,commonHooks} = require('feathers-hooks-common');

const followingSchema = {
  service: 'myfeeds',
  include: {
 service: 'feedstore',
 nameAs: 'feed',
 parentField: 'feedUrl',
 childField: 'feedUrl',
 query: {
   readCount:0,
   $sort: {createdAt: -1},
   $limit:2
},
include:   {
    service: 'following',
    nameAs: 'fav',
    parentField: '_id',
    childField: 'feedId',
    query: {
    $sort: {boost: -1},
   },
},
paginate: false,
}
};


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [...restrict],
    get: [...restrict],
    create: [...restrictAssociateCurrentUser],
    update: [...restrictAssociateCurrentUser],
    patch: [...restrictAssociateCurrentUser],
    remove: [...restrictAssociateCurrentUser]
  },

  after: {
    all: [],
    // all: [populate({ schema: followingSchema })],
    // all: [commonHooks.when(
    //         hook => hook.params.provider,
    //         commonHooks.discard('feedId','updatedAt','createdAt','__v')
    //       )],
    find: [],
    get: [],
    create: [followersCount()],
    update: [],
    patch: [],
    remove: [followersCountRemove()]
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
