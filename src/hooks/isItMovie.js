// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var mustache = require('mustache');
var guessit = require('guessit-exec');

var MovieDB = require('moviedb')('xxxx');

let feedId = '59b15c27723930832450a7f6'
let buf = '<b>{{title}}</b> </br> * {{vote_average}} * </br>'+
          '{{overview}}'+
          '</br><a href="http://www.imdb.com/title/{{imdb_id}}/reviews" target="_blank" >idbm</a> '+
          '</br> <img src="https://image.tmdb.org/t/p/w300{{{backdrop_path}}}" >'
          ;
var template = buf.toString('utf8')
let cacheTitle=[]
let timer
let ignore=['pusi','musi','Discography','Amateur','Blowjob','babe', 'hardcore','milf' ,'Teens', 'Anal' ,'18+', 'sex']
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // console.log("isitmovie wtf?",hook.data.title);

    let skip = false

    for (var i = 0; i < ignore.length; i++) {
      if (hook.data.title.toLowerCase().search(ignore[i].toLowerCase()) > -1 || hook.data.description.toLowerCase().search(ignore[i].toLowerCase()) > -1) {
        skip=true
      }
    }
    if (skip) {
      console.log("mark reed sexalot");
      hook.app.service('mystream').patch(hook.result._id, {readCount:1})
    }

    // console.log("skiper:",skip,hook.result.feedId);
    if (hook.data.title && hook.result.feedId===feedId && !skip) {
      let id = hook.result._id
      let itemId = hook.result.itemId
      let title = hook.data.title.toLowerCase()
      let boost=hook.result.boost
      let target={}
      target.title=title
      target.id=id
      target.itemId=itemId
      cacheTitle.push(target)
      clearTimeout(timer)
      timer = setTimeout(function() {
        console.log("work with:");

        function doSetTimeout(i) {
          setTimeout(function() {
            let title = cacheTitle[i].title
            let id = cacheTitle[i].id
            let itemId = cacheTitle[i].itemId
            console.log("run delay",cacheTitle);
            guessit(title)
                .then((whatIsIt) => {
                  if (whatIsIt.title && whatIsIt.year && whatIsIt.type==='movie') {
                    console.log("search movie",whatIsIt.title);
                    MovieDB.searchMovie({ query: whatIsIt.title }, (err, res) => {
                      if ("results" in res) {
                        console.log('"results" in res');
                        let movieId = res.results[0].id
                        let movieTitle = res.results[0].title
                        console.log(movieId);
                        MovieDB.movieInfo({ id: movieId}, (err, res) => {
                          console.log(res);

                            let patch = {}
                            patch.boost=boost+100
                            if (res && "genres" in res) {
                              if (res.genres.length>0) {
                                patch.tag=res.genres[0].title
                              }
                            }
                            let imdb_id = 'http://www.imdb.com/title/'+res.imdb_id+'/reviews'
                            if (!res.imdb_id) {
                              imdb_id = 'http://www.imdb.com/find?q='+res.title+'&s=all'
                            }

                            patch.description = '<b>'+
                            res.title+
                            '</b> </br> * '+
                            res.vote_average+' * </br>'+
                            res.overview+
                            '</br><a href="'+imdb_id+'" target="_blank" >idbm</a> '+
                            '</br> <img src="https://image.tmdb.org/t/p/w300'+res.backdrop_path+'">';

                            hook.app.service('feedstore').patch(itemId, patch)
                            hook.app.service('mystream').patch(id, patch)
                        });
                      }
                    })
                  }
                  else if (whatIsIt.title && whatIsIt.type==='episode') {
                    MovieDB.searchTv({ query: whatIsIt.title }, (err, res) => {
                      if ("results" in res) {
                        let movieId = res.results[0].id
                        MovieDB.tvInfo({ id: movieId}, (err, res) => {
                            let patch = {}
                            // patch.type='episode'
                            patch.boost=boost+100
                              if (res && "genres" in res) {
                              if (res.genres.length>0) {
                                patch.tag=res.genres[0].name
                              }

                            }
                            let imdb_id = 'http://www.imdb.com/title/'+res.imdb_id+'/reviews'
                            if (!res.imdb_id) {
                              imdb_id = 'http://www.imdb.com/find?q='+res.name+'&s=all'
                            }
                            // patch.description=mustache.to_html(template, res)
                            patch.description = '<b>'+
                            res.name+
                            '</b> </br> * '+
                            res.vote_average+' * </br>'+
                            res.overview+
                            '</br><a href="'+imdb_id+'" target="_blank" >idbm</a> '+
                            '</br> <img src="https://image.tmdb.org/t/p/w300'+res.backdrop_path+'">';
                            hook.app.service('feedstore').patch(itemId, patch)
                            hook.app.service('mystream').patch(id, patch)
                        });
                      }
                    })
                  }
                }).catch((e) => {
                  console.log(e);
                });

            if (cacheTitle.length===i+1) {
                console.log("clear cache");
                cacheTitle=[]
            }
          }, 2000*i);
        }

        for (var i = 0; i < cacheTitle.length; i++) {
          doSetTimeout(i)
        }


    }, 10000)
    }

    return Promise.resolve(hook);
  };
};
