const { authenticate } = require('feathers-authentication').hooks;
const {restrictToOwner,associateCurrentUser} = require('feathers-authentication-hooks');
const boostByFavorites = require('../../hooks/boostByFavorites');
const trendingwords = require('../../hooks/trendingwords');
const watchwords = require('../../hooks/watchwords');
const isItMovie = require('../../hooks/isItMovie');

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
const commonHooks = require('feathers-hooks-common');
const mapMyWithStoreSchema = {
  service: 'mystream',
  include: {
 service: 'feedstore',
 nameAs: 'item',
 parentField: 'itemId',
 childField: '_id',
//  query: {
//    readCount:0,
//    $sort: {createdAt: -1},
//    $limit:2
// },
// include:   {
//     service: 'following',
//     nameAs: 'fav',
//     parentField: '_id',
//     childField: 'feedId',
//     query: {
//     $sort: {boost: -1},
//    },
// },
paginate: false,
}
};
const mystream = require('../../hooks/mystream');
const mystreamWithFeeds = require('../../hooks/mystreamWithFeeds');
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [...restrict],
    get: [...restrict],
    create: [...restrictAssociateCurrentUser],
    update: [...restrictAssociateCurrentUser],
    patch: [...restrictAssociateCurrentUser],
    remove: [...restrictAssociateCurrentUser]
  },

  after: {
    all: [],
    find: [mystream(),mystreamWithFeeds()],
    get: [],
    create: [boostByFavorites(),trendingwords(),watchwords()],
    // create: [isItMovie()],
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
