const search = require('feathers-mongodb-fuzzy-search')
const feedTranslateRequest = require('../../hooks/feedTranslateRequest');
const distribute = require('../../hooks/distribute');
const mystreamWithFeeds = require('../../hooks/mystreamWithFeeds');
const mystreamWithFeeds2 = require('../../hooks/mystreamWithFeeds2');
// const watchwords = require('../../hooks/watchwords');
const trendingwords = require('../../hooks/trendingwords');
// const isItMovie = require('../../hooks/isItMovie');
// const boostByFavorites = require('../../hooks/boostByFavorites');
// const {populate} = require('feathers-hooks-common');
// const followingSchema = {
//   include: {
//     service: 'favorites',
//     nameAs: 'favs',
//     parentField: 'feedUrl',
//     childField: 'feedUrl'
//   }
// };


module.exports = {
  before: {
    all: [],
    find: [feedTranslateRequest(),search({ escape: false })],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    // all: [populate({ schema: followingSchema })],
    find: [mystreamWithFeeds(),mystreamWithFeeds2()],
    get: [],
    create: [distribute()],
    // create: [boostByFavorites(),trendingwords(),watchwords(),isItMovie()],
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
