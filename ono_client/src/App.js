import React, { Component } from 'react';
import client from './feathers';
import moment from 'moment';
import urlapi from 'url';
import sanitizeHtml from 'sanitize-html';
import InfiniteScroll from 'react-infinite-scroller';
import {Form,Radio,Container,Label, Modal,TextArea,Progress,Header,Sidebar,List, Dropdown, Segment,Input ,Menu,Embed,Dimmer,Loader, Grid, Popup, Rating, Icon, Image,Button,Divider, Accordion} from 'semantic-ui-react'
import './App.css';

let search;
let newFeedNameTimeout;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      modalLogin: false,
      appActive: true,
      feed: [],
      feeds: [],
      trendingStopWords: [],
      trending: [],
      watchwords: [],
      page: 0,
      feedUrls: [],
      hasMoreItems: false,
      searchTerm:'',
      activeItemMenu:'feeds',
      email:null,
      password:null,
      modalOpen:false,
      modalTrendingStopWords:false,
      modalWatchWords:false,
      lt:0,
      newFeedCount:0,
      newFeedCountAppend:false,
      loadingFeeds:false,
      selectedId:'',
      selectedIdScroll:'',
    };

    this.addNewFeed = this.addNewFeed.bind(this);
    this.addNewTrendingStopWord = this.addNewTrendingStopWord.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleDropdownClose = this.handleDropdownClose.bind(this);
    this.handleDropdownDelay = this.handleDropdownDelay.bind(this);
    this.handleManageClick = this.handleManageClick.bind(this);
    this.feedAction = this.feedAction.bind(this);
    this.getMore = this.getMore.bind(this);
    this.markReaded = this.markReaded.bind(this);
    this.toggleFav = this.toggleFav.bind(this);
    this.newFeedName = this.newFeedName.bind(this);
    this.search = this.search.bind(this);
    this.goSearch = this.goSearch.bind(this);
    this.handleTrendingStopWordsClick = this.handleTrendingStopWordsClick.bind(this);
    this.handleTrendingStopWordsRemoveClick = this.handleTrendingStopWordsRemoveClick.bind(this);
    this.goSearchTag = this.goSearchTag.bind(this);
    this.markAllRead = this.markAllRead.bind(this);
    this.getFav = this.getFav.bind(this);
    this.joinStoreWithFeeds = this.joinStoreWithFeeds.bind(this);
    this.changeTrending = this.changeTrending.bind(this);
    this.handleWatchWordsClick = this.handleWatchWordsClick.bind(this);
    this.handleWatchWordsClose = this.handleWatchWordsClose.bind(this);
    this.handleWatchWordRemoveClick = this.handleWatchWordRemoveClick.bind(this);
    this.addNewWatchWord = this.addNewWatchWord.bind(this);
    this.handleManageFeedDropdownClose = this.handleManageFeedDropdownClose.bind(this);
    this.weHaveFocus = this.weHaveFocus.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  componentDidMount() {
Promise.all([client.authenticate()]).then(([auth]) => {




// todo u funkcije da nije nabacano sve tu

  client.service('feed').find({
    query: {
      $limit: 500,
      $sort: {
        updatedAt: -1
      },
    }
    }).then((feed) => {
      console.log("feed",feed);
    let stateOptions = []
    // let stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' },]
    for (var i = 0; i < feed.data.length; i++) {

      let a={}
      a.key=i
      a.value=feed.data[i]._id
      a.text= feed.data[i].feedName?feed.data[i].feedName:urlapi.parse(feed.data[i].feedUrl).hostname
      a.image=feed.data[i].avatar
      stateOptions.push(a)
    }
    this.setState({feed:stateOptions})
  }).catch(error_1 => {
    console.log(error_1);
  });
  this.getMore()
  // u funk


      }).catch(error => {console.log(error)})

      client.on('logout', () => this.logoutClear())
    client.on('authenticated', login => {
      this.setState({email:login.user.email,modalLogin:false})
    });

    // get feedUrls
    setInterval( checkPageFocus.bind(this), 5000 );

    function checkPageFocus() {
      if (document.hasFocus()) {
        // console.log("focus");
        if (!this.state.appActive){
        console.log("setState focus",this.state.appActive);
        this.setState({appActive:true})
        this.weHaveFocus()
      }
      } else {
        // console.log("focus lost");
        if (this.state.appActive){
          this.setState({appActive:false})
          document.title = "Noter zzZZZZZ";
          console.log("setState lost focus",this.state.appActive);
        }

      }
    }
    this.weHaveFocus()

    // client.service('feedstore').find({
    //   query: {
    //     readCount: {
    //       $lte: this.state.lt
    //     },
    //     $sort: {
    //       boost: -1,
    //       createdAt: -1
    //     },
    //   }
    //   }).then((notes) => {
    //     let hasMore = true
    //     if (notes.data.length===0) {
    //       hasMore = false
    //     }
    //     let newFeedCount = notes.total
    //     if (newFeedCount>=999) {
    //       newFeedCount=999
    //     }
    //     document.title = "Noter ("+notes.total+")";
    //
    //
    //     this.setState({notes:notes.data,newFeedCount:newFeedCount,hasMoreItems: hasMore,loadingFeeds:false})
    //
    //     this.joinStoreWithFeeds(notes.data)
    //
    //
    // });
    client.service('feedstore').on('created', notes => {
      clearTimeout(search)
      search = setTimeout(function() {
        let newFeedCount = parseInt(this.state.newFeedCount)+1
        document.title = "Hoooo, something new!";
        this.setState({newFeedCountAppend:true})
      }.bind(this), 100)
    });

    client.service('mystream').on('patched', notes => {
      // console.log(notes);
      clearTimeout(search)
      search = setTimeout(function() {
      let currentFeed= this.state.notes;
      // generate new feed for click on item marking fav and reeded, it works only for one.
      // let newFeed=[]
      for (var i = 0; i < currentFeed.length; i++) {
        if (currentFeed[i]._id===notes._id) {
          console.log("mark read");
          currentFeed[i].readCount=currentFeed[i].readCount+1
          currentFeed[i].fav=notes.fav
        }
        // newFeed.push(currentFeed[i])
      }
      client.service('mystream').find({
        query: {
          createdAt: {
            $gte: moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
          },
          readCount: {
            $lte: this.state.lt
          },
          $limit: 0,
        }
      }).then((feedstoreCount) => {
        console.log("patched",feedstoreCount);
        if (this.state.activeItemMenu!='favorite') {
          let newFeedCount = feedstoreCount.total
          if (newFeedCount>=999) {
            newFeedCount=999
          }
          this.setState({loadingFeeds:false,newFeedCount:newFeedCount,selectedId:''})
          document.title = "Noter patch ("+feedstoreCount.total+")";
        }else {
          this.setState({loadingFeeds:false,selectedId:''})
        }

      });
    }.bind(this), 100)
    });

    client.service('trending').on('created', notes => {
      client.service('trending').find({
        query: {
          $sort: {
            createdAt: -1,
          },
        }
      }).then((notes) => {
        let uniq = []
        let trendingData = []
        for (var i = 0; i < notes.data.length; i++) {
          if (uniq.indexOf(notes.data[i].word) === -1) {
            uniq.push(notes.data[i].word)
            trendingData.push(notes.data[i])
          }
        }
        this.setState({trending:trendingData})
      });
    });

    client.service('feed').on('created', notes => {
      this.setState({feeds:[notes]})

    });
    client.service('feed').on('removed', notes => {
      client.service('feed').find({
          query: {
            $limit: 500,
            $sort: {
              updatedAt: -1
            },
          }
          }).then((feed) => {
            console.log("feed",feed);
          let stateOptions = []
          // let stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' },]

          for (var i = 0; i < feed.data.length; i++) {
            let a={}
            a.key=i
            a.value=feed.data[i]._id
            a.text= feed.data[i].feedName?feed.data[i].feedName:urlapi.parse(feed.data[i].feedUrl).hostname
            a.image=feed.data[i].avatar
            stateOptions.push(a)
          }
          this.setState({feed:stateOptions})
        });

      client.service('feed').find({
          query: {
            $limit: 500,
            $sort: {
              updatedAt: -1
            },
          }
        }).then((feed) => {
          let listed=[]
          let remain=[]
          console.log(this.state.feeds);
          for (var i = 0; i < this.state.feeds.length; i++) {
            listed.push(this.state.feeds[i].feedUrl)
          }
          console.log(listed);
          for (var i = 0; i < feed.data.length; i++) {
            if (listed.indexOf(feed.data[i].feedUrl) > -1) {
              remain.push(feed.data[i])
            }
          }
          this.setState({feeds:remain})
        });

    });

    client.service('feed').on('patched', notes => {
      // this.setState({notes:[],hasMoreItems:false})
      let feeds=this.state.feeds

      // this.setState({feeds:feeds})
      //
      client.service('feed').find({
          query: {
            $limit: 500,
            // $sort: {
            //   updatedAt: -1
            // },
          }
          }).then((feed) => {
            console.log("feed",feed);
          let stateOptions = []
          // let stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' },]

          for (var i = 0; i < feed.data.length; i++) {
            let a={}
            a.key=i
            a.value=feed.data[i]._id
            a.text= feed.data[i].feedName?feed.data[i].feedName:urlapi.parse(feed.data[i].feedUrl).hostname
            a.image=feed.data[i].avatar
            stateOptions.push(a)
            if (feed.data[i]._id===notes._id) {
              for (var i2 = 0; i2 < feeds.length; i2++) {
                feeds[i2]=feed.data[i]
              }
            }
          }
          this.setState({feed:stateOptions})
        });
      // this.setState({feeds:feeds})
    });


  }

  weHaveFocus(){
    Promise.all([client.authenticate()]).then(([auth]) => {
      this.setState({loadingFeeds:true})
    // get trending
    client.service('trending').find({
      query: {
        $sort: {
          createdAt: -1,
        },
        $limit:10,
      }
      }).then((notes) => {
        let uniq = []
        let trendingData = []
        for (var i = 0; i < notes.data.length; i++) {
          if (uniq.indexOf(notes.data[i].word) === -1) {
            uniq.push(notes.data[i].word)
            trendingData.push(notes.data[i])
          }
        }
        // let unique = [...new Set(notes.data.map(item => item.word))];
        this.setState({trending:trendingData})
    });

    client.service('mystream').find({
      query: {
        createdAt: {
          $gte: moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
        },
        readCount: {
          $lte: this.state.lt
        },
        $limit: 0,
      }
    }).then((feedstoreCount) => {
      if (this.state.activeItemMenu!='favorite') {
        let newFeedCount = feedstoreCount.total
        if (newFeedCount>=999) {
          newFeedCount=999
        }
        this.setState({loadingFeeds:false,newFeedCount:newFeedCount,selectedId:''})
        document.title = "Welcome back ("+feedstoreCount.total+")";
      }else {
        this.setState({loadingFeeds:false,selectedId:''})
      }

    });
    }).catch(error => {console.log(error)})
  }

  addNewFeed(event) {
    let feed = this.state.searchTerm

    console.log("feed",feed);

    if (urlapi.parse(feed).hostname) {
      console.log("store new note",feed);
      Promise.all([
        client.service('feed').create({
          feedUrl: feed.trim(),
          tag:'rss',
          delay:30,
        })
      ]).then(([createFeedResponse]) => {
        let stateOptions = this.state.feed

          let a={}
          a.key=this.state.feed.length+1
          a.value=createFeedResponse._id
          a.text= createFeedResponse.feedName?createFeedResponse.feedName:urlapi.parse(createFeedResponse.feedUrl).hostname
          a.image=createFeedResponse.avatar
          stateOptions.push(a)

          this.setState({feed:stateOptions})
        // this.setState({feeds:createFeedResponse})
      }).catch(error_1 => {
        console.log(error_1);
      })
    }

  }

  handleManageFeedDropdownClose(event,data){
    this.scroll.pageLoaded = 0
    this.setState({activeItemMenu:'feeds'})
    if (data.value.length===0) {
      this.setState({feeds:[]})
    } else
    {
      console.log(data.value);
      client.service('feed').find({
      query: {
        _id: {
          $in: data.value,
        },
        // $sort: {
        //   createdAt: -1
        // },
      }
    }).then((feed) => {
      console.log(feed);
      this.setState({feeds:feed.data})
    });



    }
  }
  addNewTrendingStopWord(event) {

    let stopWord = event.currentTarget.value;
    if (event.key==='Enter') {
      console.log("store new stopWord",stopWord);
      Promise.all([
        client.service('stopwords').create({
          word: stopWord.trim(),
        })
      ]).then(([createStopWordResponse]) => {
        this.handleTrendingStopWordsClick()
        // console.log(createStopWordResponse);
      }).catch(error_1 => {
        console.log(error_1);
      })
    }

  }

  loadMore(page) {
    console.log("page:",page);
    if (this.state.feedUrls.length===0 && this.state.searchTerm.length===0 && this.state.activeItemMenu!='favorite') {
      console.log("if (this.state.feedUrls.length===0) {");
      client.service('mystream').find({
        query: {
          readCount: {
            $lte: this.state.lt
          },
          createdAt: {
            $gte: moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
          },
          $sort: {
            boost: -1,
            createdAt: -1
          },
          $skip:page*10
        }
      }).then((notes) => {
        // console.log(notes.total,notes.data.length,notes);
        if (notes.data.length===0) {
          this.setState({  hasMoreItems: false});
        }else {
          let appendNote=this.state.notes

          for (var i = 0; i < notes.data.length; i++) {
          appendNote.push(notes.data[i])

          // console.log(notes.data[i].readCount);
          }
          // let cutme =appendNote.slice(Math.max(appendNote.length - 20, 0))
          //
          // console.log(appendNote.length,cutme);
          let newFeedCount = notes.total
          if (newFeedCount>=999) {
            newFeedCount=999
          }
          this.setState({notes:appendNote,newFeedCount:newFeedCount})
          // this.joinStoreWithFeeds(appendNote)
        }
        //

      });
    } else if (this.state.searchTerm.length>0) {
          let searchTerm=this.state.searchTerm
          console.log("else if this.state.searchTerm.length>0",searchTerm);

          client.service('feedstore').find({
            query: {
              $search: searchTerm,
              $sort: {
                createdAt: -1
              },
              $skip:page*10
            }
          }).then((notes) => {
            // console.log(notes.total,notes.data.length,notes);
            if (notes.data.length===0) {
              this.setState({  hasMoreItems: false});
            }else {
              let appendNote=this.state.notes

              for (var i = 0; i < notes.data.length; i++) {
              appendNote.push(notes.data[i])

                // client.service('feedstore').patch(notes.data[i]._id,{
                //   readCount: notes.data[i].readCount+1,
                // })
              // console.log(notes.data[i].readCount);
              }

              // console.log(appendNote);
              let newFeedCount = notes.total
              if (newFeedCount>=999) {
                newFeedCount=999
              }
              this.setState({notes:appendNote,newFeedCount:newFeedCount})
              // this.joinStoreWithFeeds(appendNote)
            }
            //

          });
        }
        else if (this.state.activeItemMenu==='favorite') {
              console.log("else if favorite");

              client.service('mystream').find({
                query: {
                  fav: 1,
                  $sort: {
                    createdAt: -1
                  },
                  $skip:page*10
                }
              }).then((notes) => {
                // console.log(notes.total,notes.data.length,notes);
                if (notes.data.length===0) {
                  this.setState({  hasMoreItems: false});
                }else {
                  let appendNote=this.state.notes

                  for (var i = 0; i < notes.data.length; i++) {
                  appendNote.push(notes.data[i])

                    // client.service('feedstore').patch(notes.data[i]._id,{
                    //   readCount: notes.data[i].readCount+1,
                    // })
                  // console.log(notes.data[i].readCount);
                  }

                  // console.log(appendNote);
                  let newFeedCount = notes.total
                  if (newFeedCount>=999) {
                    newFeedCount=999
                  }
                  this.setState({notes:appendNote,newFeedCount:newFeedCount})
                  // this.joinStoreWithFeeds(appendNote)
                }
                //

              });
            }
    else {
      console.log("else skip",page*10);
      client.service('mystream').find({
        query: {
          feedId: {
            $in: this.state.feedUrls,
          },
          // readCount: {
          //   $lte: this.state.lt
          // },
          $sort: {
            createdAt: -1
          },
          $skip:page*10
        }
      }).then((notes) => {
        // console.log(notes);
        if (notes.data.length===0) {
          this.setState({  hasMoreItems: false});
        }else {
          let appendNote=this.state.notes

          for (var i = 0; i < notes.data.length; i++) {

          appendNote.push(notes.data[i])

            // client.service('feedstore').patch(notes.data[i]._id,{
            //   readCount: notes.data[i].readCount+1,
            // })
          // console.log(notes.data[i].readCount);
          }

          // console.log(appendNote);
          let hasMore = false
          if (notes.total>10) {
            hasMore = true
          }
          let newFeedCount = notes.total
          if (newFeedCount>=999) {
            newFeedCount=999
          }
          this.setState({notes:appendNote,newFeedCount:newFeedCount,hasMoreItems: hasMore})
          // this.joinStoreWithFeeds(appendNote)
        }
        //

      });
    }

    // if (page===2) {
    //   this.setState({  hasMoreItems: false});
    // }


  }

  handleDropdownClose(event,data){
    this.scroll.pageLoaded = 0
    this.setState({activeItemMenu:'feeds'})
    if (data.value.length===0) {
      console.log("feeds dropdown empty");
      client.service('mystream').find({
        query: {
          readCount: {
            $lte: this.state.lt
          },
          $sort: {
            createdAt: -1
          },
        }
      }).then((notes) => {
        let hasMore = false
        if (notes.total>10) {
          hasMore = true
        }
        let newFeedCount = notes.total
        if (newFeedCount>=999) {
          newFeedCount=999
        }
        this.setState({notes:notes.data,newFeedCount:newFeedCount,hasMoreItems: false,page:0,feedUrls:[]})
        // this.joinStoreWithFeeds(notes.data)
        // for (var i = 0; i < notes.data.length; i++) {
        //   client.service('feedstore').patch(notes.data[i]._id,{
        //     readCount: notes.data[i].readCount+1,
        //   })
        // }
      });

    }else {

      console.log(data.value,"jep");
      client.service('mystream').find({
      query: {
        // readCount: {
        //   $lte: this.state.lt
        // },
        feedId: {
          $in: data.value,
        },
        $sort: {
          createdAt: -1
        },
      }
    }).then((notes) => {
      // console.log(notes);
      let hasMore = false
      if (notes.total>0) {
        hasMore = true
      }
      let newFeedCount = notes.total
      if (newFeedCount>=999) {
        newFeedCount=999
      }



      this.setState({notes:notes.data,newFeedCount:newFeedCount,feedUrls:data.value,hasMoreItems: hasMore,page:0,searchTerm:''})
      // this.joinStoreWithFeeds(notes.data)

      // for (var i = 0; i < notes.data.length; i++) {
      //   client.service('feedstore').patch(notes.data[i]._id,{
      //     readCount: notes.data[i].readCount+1,
      //   })
      // }
    });
    }
  }

  handleManageClick(){
    console.log("handleManageClick");
    // this.setState({notes:[],hasMoreItems:false})
    client.service('feed').find({
      query: {
        $limit: 500,
        $sort: {
          updatedAt: -1
        },
      }
    }).then((feed) => {

      this.setState({modalOpen:true})

      // this.setState({feeds:feed.data,modalOpen:true})
    }).catch(error_1 => {
      console.log(error_1,"error_1 handleManageClick");
    });

  }


  handleClose = (e) => this.setState({
     modalOpen: false,
   })

  feedAction(event,data){
    let feeds = this.state.feeds
    // console.log(feeds);
    let action=event.currentTarget.dataset.action;
    let id=event.currentTarget.dataset.id;
    let feedUrl=event.currentTarget.dataset.feed;


    if (action==='refresh') {
      for (var i = 0; i < feeds.length; i++) {
        if (feeds[i]._id===id) {
          feeds[i].statusCode="parsing"
        }
      }
      this.setState({feeds:feeds})
    Promise.all([
      client.service('feed').patch(id,{})
    ]).then(([feedUrlResponse]) => {
      console.log("feedUrlResponse",feedUrlResponse);

    }).catch(error_1 => {
      console.log("error_1 feedAction");
    })
    }
    if (action==='remove') {
      client.service('feed').remove(id,{})
      client.service('feedstore').remove(null,{query:{feedId:id}})
      client.service('mystream').remove(null,{query:{feedId:id}})
    }

    if (data['data-action']==='image') {
      let newImage=event.currentTarget.value;
      client.service('feed').patch(data['data-id'], { avatar:newImage })

      console.log("new image",newImage);
    }
    // console.log(id,action,feedUrl);
  }

  handleDropdownDelay (event,data){
    let id=event.currentTarget.dataset.id;
    // console.log(data['data-id'],data.value);
    client.service('feed').patch(data['data-id'], { delay:data.value })

  }

  getMore(){
    console.log("getMore");
    console.log(moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss'));

    console.clear()
    this.setState({feedUrls:[]})
    if (this.state.activeItemMenu==='feeds') {
      this.markAllRead()
    }

    this.setState({loadingFeeds:true,newFeedCountAppend:false})
    window.scrollTo(0, 0)
    this.scroll.pageLoaded = 0
    client.service('mystream').find({
      query: {
        readCount: {
          $lte: this.state.lt
        },
        createdAt: {
          $gte: moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
        },
        $sort: {
          boost: -1,
          createdAt: -1
        },
      }
    }).then((notes) => {
      console.log("getmore notes");
      let hasMore = true
      if (notes.data.length===0) {
        hasMore = false
      }
      let newFeedCount = notes.total
      if (newFeedCount>=999) {
        newFeedCount=999
      }
      document.title = "Noter ("+notes.total+")";

      this.setState({
        notes:notes.data,
        newFeedCount:newFeedCount,
        searchTerm:'',
        activeItemMenu:'feeds',
        loadingFeeds:false,
        hasMoreItems:hasMore
      })
      // this.joinStoreWithFeeds(notes.data)
    });
  }

  markReaded (event,data)
  {
    let selectedIdScroll = event.currentTarget.dataset.id
    let id = event.currentTarget.dataset.id
    let readCount = event.currentTarget.dataset.readcount
    console.log(readCount);
    if (!readCount) {
      readCount=0
    }
    if (this.state.selectedIdScroll===selectedIdScroll) {
      selectedIdScroll=''
    }
    this.setState({selectedId:id,selectedIdScroll:selectedIdScroll})
    client.service('mystream').patch(id,{
      readCount: readCount+1,
    })

  }

  toggleFav (event,data)
  {
    let id = event.currentTarget.dataset.id
    let fav = event.currentTarget.dataset.fav
    this.setState({selectedId:id,loadingFeeds:true})
    // console.log(fav);
    if (parseInt(fav)===0) {
      fav = 1
    }else {
      fav=0
    }
    console.log(fav,id);
    client.service('mystream').patch(id,{
      fav: fav
    })

  }
  newFeedName (event,data)
  {
    let id = data['data-id']
    let value = event.currentTarget.value;
    let feeds = this.state.feeds
    for (var i = 0; i < feeds.length; i++) {
      if (feeds[i]._id===id) {
        feeds[i].feedName=value
      }
    }
    this.setState({feeds:feeds})

    clearTimeout(newFeedNameTimeout)
    newFeedNameTimeout = setTimeout(function() {
    client.service('feed').patch(id,{
      feedName: value
    })
  }.bind(this), 1000)
  }

  search(event,value){
    this.setState({searchTerm:value})
    // console.log(value);
    //   if (event.key==='Enter') {
    //     this.goSearch()
    //   }
  }
  goSearch(){
    this.setState({loadingFeeds:true,selectedId:''})
    let searchTerm=this.state.searchTerm
    console.log(searchTerm);
        client.service('feedstore').find({
          query: {
            $search: searchTerm,
            $sort: {
              createdAt: -1
            },
          }
        }).then((notes) => {
          console.log(notes);
          this.setState({notes:notes.data,newFeedCount:notes.total,feedUrls:[],loadingFeeds:false})
          // this.joinStoreWithFeeds(notes.data)
          if (notes.total>10) {
            this.setState({hasMoreItems:true})
          }
        });
  }

  handleTrendingStopWordsClick(){

    client.service('stopwords').find({
      query: {
        $limit: 1000,
        $sort: {
          createdAt: -1
        },
      }
    }).then((feed) => {
      this.setState({trendingStopWords:feed.data,modalTrendingStopWords:true})
    });
  }

  getFav(){
    this.setState({loadingFeeds:true})
    window.scrollTo(0, 0)
    this.scroll.pageLoaded = 0
    client.service('mystream').find({
      query: {
        fav:true,
        $sort: {
          createdAt:-1
        },
      }
    }).then((feed) => {
      let hasMore = true
      if (feed.data.length===0) {
        hasMore = false
      }
      this.setState({
        notes:feed.data,
        activeItemMenu:'favorite',
        searchTerm:'',
        feedUrls:[],
        newFeedCount:feed.total,
        hasMoreItems: hasMore,
        loadingFeeds:false
      })
        // this.joinStoreWithFeeds(feed.data)
    });
  }

  handleTrendingStopWordsRemoveClick(event,data){
    let id = event.currentTarget.dataset.id
    client.service('stopwords').remove(id,{})
    client.service('stopwords').find({
      query: {
        $limit: 1000,
        $sort: {
          createdAt: -1
        },
      }
    }).then((feed) => {
      this.setState({trendingStopWords:feed.data})
    });
  }

  handleTrendingStopWordsClose = (e) => this.setState({
     modalTrendingStopWords: false,
   })

  goSearchTag(event,data){
    this.scroll.pageLoaded = 0
    this.setState({searchTerm:data['data-word'],feedUrls:[],activeItemMenu:'feeds'})
    clearTimeout(search)
    search = setTimeout(function() {
      this.goSearch()
    }.bind(this), 100)

  }

  markAllRead(){
    let leveLast = this.state.notes.length
    for (var i = 0; i < leveLast; i++) {
      if (!this.state.notes[i].readCount) {
        this.state.notes[i].readCount=0
      }
      if (this.state.notes[i].readCount===0 && leveLast>10 && i < leveLast-5) {
        console.log(this.state.notes[i].title);
        client.service('mystream').patch(this.state.notes[i]._id, { readCount: 1 })
      }
    }

    // client.service('feedstore').find({
    //   query: {
    //     readCount: {
    //       $lte: this.state.lt
    //     },
    //     $limit: 0,
    //   }
    // }).then((feedstoreCount) => {
    //     let newFeedCount = feedstoreCount.total
    //     if (newFeedCount>=999) {
    //       newFeedCount=999
    //     }
    //     this.setState({loadingFeeds:false,newFeedCount:newFeedCount,selectedId:''})
    //     document.title = "Noter ("+feedstoreCount.total+")";
    //
    //
    // });


  }

  joinStoreWithFeeds(data){
    let trendingWords=[]
    for (var i = 0; i < this.state.trending.length; i++) {
      trendingWords.push(this.state.trending[i].word)
    }
    console.log("call joinStoreWithFeeds");
    let newNotes=[]
    for (var i = 0; i < data.length; i++) {

      client.service('feed').find({
        query: {
          feedUrl:data[i].feedUrl
        }
      }).then((feed) => {
        newNotes.push(1)

        for (var i = 0; i < data.length; i++) {
          if (data[i].feedUrl===feed.data[0].feedUrl) {
            data[i].avatar=feed.data[0].avatar
            data[i].feedName=feed.data[0].feedName
            data[i].trending=feed.data[0].trending
            // let words = data[i].title.split(" ");
            // let isWordExist=[]
            // for (var i1 = 0; i1 < words.length; i1++) {
            //   let word = words[i1].replace(/\W/g, '').toLowerCase();
            //   if (word.length>=3) {
            //       isWordExist.push(trendingWords.indexOf(word) > -1)
            //   }
            //   //
            // }
            // data[i].boost=isWordExist.indexOf(true) > -1
            // data[i].boost=feed.data[0].boost

          }
        }
          //
          //
          if (newNotes.length===data.length) {
            this.setState({notes:data})
          }



      });
    }

    //
  }

  changeTrending(event,data){
    let id = data['data-id']
    let val = 1
    if (!data.checked) {
      val = 0
    }
    client.service('feed').patch(id,{
      trending: val
    })
  }

  handleWatchWordsClick(){
    this.setState({modalWatchWords:true})

    client.service('watchword').find({
      query: {
        $limit: 500,
        $sort: {
          createdAt: -1
        },
      }
    }).then((watchwords) => {
      this.setState({watchwords:watchwords.data})
    });
  }

  handleWatchWordsClose = (e) => this.setState({
     modalWatchWords: false,
   })

  addNewWatchWord(event) {

     let watchWord = event.currentTarget.value;
     if (event.key==='Enter') {
       Promise.all([
         client.service('watchword').create({
           word: watchWord.trim(),
         })
       ]).then(([watchWordResponse]) => {
         console.log("refresh w words");
         this.handleWatchWordsClick()
         // console.log(createStopWordResponse);
       }).catch(error_1 => {
         console.log(error_1);
       })
     }

   }
  handleWatchWordRemoveClick(event,data){
     let id = event.currentTarget.dataset.id
     client.service('watchword').remove(id,{})
     client.service('watchword').find({
       query: {
         $limit: 1000,
         $sort: {
           createdAt: -1
         },
       }
     }).then((watchwords) => {
       this.setState({watchwords:watchwords.data})
     });
   }

   handleLoginClose = () => this.setState({ modalLogin: false })
   handleLoginOpen = () => this.setState({ modalLogin: true })
   handleLoginChange = (e, { name, value }) => this.setState({ [name]: value })

   handleLoginSubmit() {
     const { email,password } = this.state
     console.log(email,password);
     client.authenticate({
       strategy: 'local',
       email: email,
       password: password
     }).then((result) => {
       console.log('Authenticated!', result);
       this.setState({email:result.user.email,password:'',modalLogin:false})
       window.location.reload()
     }).catch((error)=>{
       console.error('Error authenticating!', error);
     });
    //  const { name, email } = this.state
     //
    //  this.setState({ submittedName: name, submittedEmail: email })
    }

  logoutClear =() =>{
    this.setState({
      email: null,
      password: null,
    })
    localStorage.clear();
    window.location.reload()
  }

  changeFollow =(event,data) =>{
    let id = data['data-id']
    let feedUrl = data['data-feedurl']
    if (data.checked) {
      console.log("myfeeds follow",id);

      client.service('myfeeds').create({
        feedId: id,
        feedUrl: feedUrl,
        follow: true,
      })
    }else {
      console.log("myfeeds remove",id);

      client.service('myfeeds').remove(null,{query:{feedId:id}})
    }

  }

render() {
    // console.log(this.state);
  let stateOptions = [
      { key: 10, value: 10, text: '10 min' },
      { key: 15, value: 15, text: '20 min' },
      { key: 30, value: 30, text: '30 min' },
      { key: 60, value: 60, text: '1h' },
      { key: 120, value: 120, text: '2h' },
      { key: 240, value: 240, text: '4h' },
      { key: 480, value: 480, text: '8h' },
      { key: 1440, value: 1440, text: '24h' },
      { key: 1440000000, value: 1440000000, text: 'pause' },
    ]
    const loaderIcon = <Loader size="mini" active inverted inline/>
    return (

      <div className="App">

<Menu
size='small'
widths={3}
fixed={"top"}
fluid={true}
inverted={true}
borderless={false}
>
<Menu.Item
name='feeds'
active={this.state.activeItemMenu === 'feeds'}
onClick={this.getMore}
>
<Icon name={this.state.newFeedCountAppend?'refresh':'mail'} /> Feeds
<Label size="medium" style={{minHeight:"22px",minWidth:"45px"}}color="green">{this.state.loadingFeeds?loaderIcon:this.state.newFeedCount>=999?this.state.newFeedCount+"+":this.state.newFeedCount}</Label>

</Menu.Item>

<Menu.Item
name='favorite'
active={this.state.activeItemMenu === 'favorite'}
onClick={this.getFav}
>
Fav
</Menu.Item>
  <Dropdown item text="More">
    <Dropdown.Menu>
         <Dropdown.Item  icon="settings" onClick={this.handleManageClick} text='Manage feeds' />
        <Dropdown.Item icon="search" onClick={this.handleWatchWordsClick} text='Watch words' />
        <Dropdown.Item icon="stop circle" onClick={this.handleTrendingStopWordsClick} text='Ignore words' />
        <Dropdown.Divider />
        <Dropdown.Header>User {this.state.email}</Dropdown.Header>
          <Dropdown.Item onClick={this.state.email?() => client.logout():this.handleLoginOpen } >
            <Icon  name='log out' />{this.state.email?'logout':'login'}</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>

</Menu>
<p>&nbsp;</p>
<p>&nbsp;</p>

<Modal
  open={this.state.modalLogin}
  onClose={this.handleLoginClose}
  closeIcon='close'>
  <Modal.Header>Login</Modal.Header>
  <Modal.Content >
  <Form onSubmit={this.handleLoginSubmit}>
      <Form.Field>
        <label>First Name</label>
        <Form.Input placeholder='Name' name='email' value={this.state.email} onChange={this.handleLoginChange} />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <Form.Input type="password" placeholder='Password' name='password' value={this.state.password} onChange={this.handleLoginChange} />
      </Form.Field>

      <Button type='submit'>Login</Button>
    </Form>
  </Modal.Content>
</Modal>



<Modal
  open={this.state.modalOpen}
  onClose={this.handleClose}
  // dimmer={false}
  size="fullscreen"
  closeIcon='close'>

  <Modal.Header>    Manage feeds ({this.state.feed.length})</Modal.Header>

    <Modal.Content  scrolling>
    <Modal.Description>
    {/* <Input icon='add' placeholder='add new feed' fluid onKeyPress={this.addNewFeed}/>*/}
    <Dropdown
    onSearchChange={this.search}
    onChange={this.handleManageFeedDropdownClose}
    placeholder='feeds'
    fluid
    search
    selection
    options={this.state.feed}
    noResultsMessage={  <Label onClick={this.addNewFeed} color="grey" circular size="medium"> <Icon name='search' /> Add </Label>}/>
    <div style={{minHeight:"200px"}}>
    <Divider/>
    <List>
       {this.state.feeds.map( (row, index) => (
         <List.Item key={row._id}  >


            <Popup key={row._id} wide trigger={<Image src={row.avatar} avatar />} on='click'>
            <div style={{minWidth:"200px"}}>Change image for {row.feedUrl}
            <Input data-action="image" data-id={row._id} data-feed={row.feedUrl}  onChange={this.feedAction} icon='add' size="large"  placeholder='new image' fluid/>
            </div>
            </Popup>
           <List.Content >
              <List.Description >

          <Input size='mini' data-id={row._id} placeholder={urlapi.parse(row.feedUrl).pathname +" "+  urlapi.parse(row.feedUrl).hostname}  value={row.feedName?row.feedName:row.feedUrl} fluid onChange={this.newFeedName}/>
           <br/>
           <List.Icon name='remove' data-action="remove" data-id={row._id} data-feed={row.feedUrl}  onClick={this.feedAction}  />
          &nbsp;
          <div style={{width:"100px",display: "inline-block"}}>
          <Dropdown
          onChange={this.handleDropdownDelay}
          data-id={row._id}
          placeholder='delay'
          className="date"
          defaultValue={row.delay}
          fluid
          inline
          selection
          options={stateOptions} />
          </div>
          &nbsp;
           <Icon data-action="refresh" data-id={row._id} data-feed={row.feedUrl}  onClick={this.feedAction} name='refresh' loading={row.statusCode!=200?true:false} />
           <span> <Label color={row.statusCode===200?'green':'red'} circular size="mini"> <Icon name={row.statusCode===200?'check':'exclamation'} /> <a target="_blank" href={"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/"+row.statusCode}>{row.statusCode}</a> </Label> </span>
           <span className="date">{moment.duration(moment()-moment(row.updatedAt)).humanize() } ago. </span>
                 <Radio fitted toggle label="follow" data-id={row._id} data-feedurl={row.feedUrl} checked={row.following} onChange={this.changeFollow}/>
                 <Radio fitted toggle label="trending" data-id={row._id} checked={row.trending} onChange={this.changeTrending}/>
           <Divider/>

             </List.Description>

           </List.Content>
         </List.Item>
       ))}
       </List>

       </div>
    </Modal.Description>
  </Modal.Content>
</Modal>


<Modal
  open={this.state.modalTrendingStopWords}
  onClose={this.handleTrendingStopWordsClose}
  closeIcon='close'>
  <Modal.Header>Manage stop words</Modal.Header>
  <Modal.Content scrolling>
    <Modal.Description>
 <Input icon='add' placeholder='add new stop word' fluid onKeyPress={this.addNewTrendingStopWord}/>
  <Divider/>
    <List>
       {this.state.trendingStopWords.map( (row, index) => (
         <List.Item key={index}  >
          <List.Icon name='tag' />

           <List.Content >
              <List.Description >
              {row.word}  <List.Icon data-id={row._id} onClick={this.handleTrendingStopWordsRemoveClick} name='remove' />
             </List.Description>

           </List.Content>
         </List.Item>

       ))}
       </List>


    </Modal.Description>
  </Modal.Content>
</Modal>


<Modal
  open={this.state.modalWatchWords}
  onClose={this.handleWatchWordsClose}
  closeIcon='close'>
  <Modal.Header>  Manage watch words  </Modal.Header>
  <Modal.Content scrolling>
    <Modal.Description>
      <Input icon='add' placeholder='add new watch word' fluid onKeyPress={this.addNewWatchWord}/>
      <Divider/>
    <List>
       {this.state.watchwords.map( (row, index) => (
         <List.Item key={index}  >
          <List.Icon name='tag' />

           <List.Content >
              <List.Description >
              {row.word}  <List.Icon data-id={row._id} onClick={this.handleWatchWordRemoveClick} name='remove' />
             </List.Description>

           </List.Content>
         </List.Item>

       ))}
       </List>


    </Modal.Description>
  </Modal.Content>
</Modal>

<Container text >


      <Dropdown key={"mainDrop"} onSearchChange={this.search} onChange={this.handleDropdownClose} placeholder='feeds' fluid multiple search selection options={this.state.feed} noResultsMessage={  <Label onClick={this.goSearch} color="grey" circular size="medium"> <Icon name='search' /> Search </Label>}/>


      </Container>

      <Container text>

      {this.state.trending.map( (row, index) => (
        <Label key={index} style={{cursor:'pointer'}} onClick={this.goSearchTag} color="grey" data-word={row.word} circular size="mini"> <Icon name='tag' /> {row.word} </Label>
      ))}
      </Container>
      <Divider/>
      <Container text>

      <InfiniteScroll
          ref={(scroll) => { this.scroll = scroll; }}
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={this.state.hasMoreItems}
          loader={<div className="loader">Loading more garbage ... <Loader size="mini" active inverted inline/></div>}
          useWindow={true}>


          <List size={'small'} divided relaxed>

         {this.state.notes.map( (row, index) => (
           <List.Item key={row._id}  >
             <List.Content >

              <div style={{marginBottom:"5px"}}>

              {row.avatar?<Image inline src={row.avatar} avatar />:<Loader size="small" active inverted inline/>}

              {row.alert?<Icon color={row.readCount===0?'red':'green'} name={row.readCount===0?'bell':'bell outline'} />:''}
              {row.trending?<Icon color={row.readCount===0?'red':'green'} name={row.readCount===0?'bar chart':'bar chart outline'} />:''}
              {row.type?<Icon color={row.readCount===0?'red':'green'} name='film' />:''}

              <span className="date">{row.feedName}</span>
              <span className="date"> {moment.duration(moment()-moment(row.createdAt)).humanize() } ago. </span>
              </div>
             <List.Header> <span > <a className={row.readCount===0?'title':'titleReaded'} href={row.link} target="new_tab">{row.title}</a><br/></span></List.Header>

                <List.Description className="Description" onClick={this.markReaded} data-id={row._id} data-readCount={row.readcount}>


                <br/>
             <span className={this.state.selectedIdScroll===row._id?"feed":'feedH'} dangerouslySetInnerHTML={{__html: sanitizeHtml(row.overview?row.overview:row.description, {allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])  }) } }></span>
             <br/>

           {Array.isArray(row.tag)?row.tag.map( (row1, index1) => (<Label key={index1} style={{marginTop:"5px"}} color="grey" circular size="mini"> <Icon name='tag' /> {row1.name}  </Label>)):<Label style={{marginTop:"5px"}} color="grey" circular size="mini"> <Icon name='tag' /> {row.tag}  </Label>}

             {row.trending?<Icon name='assistive listening systems' />:""}


               </List.Description>



                 <List.List>
               <List.Item>
                 <List.Content>
                 <List.Header style={{minHeight:"20px"}}>
                 <a href={"whatsapp://send?text="+row.title+" "+row.link} data-action="share/whatsapp/share"> <Icon color="green" size="large" name='whatsapp'  /></a>

                 <Icon onClick={this.toggleFav} data-id={row._id} data-fav={row.fav>0?1:0}  color={row.fav===1?'orange':'grey'} size="large" name='favorite' />
                 {this.state.selectedId===row._id?loaderIcon:''}
                 </List.Header>
                <List.Description> <Divider style={{minWidth:"300px",maxWidth:"300px"}} inverted/></List.Description>
                 </List.Content>
               </List.Item>

                  </List.List>



             </List.Content>






           </List.Item>
         ))}

         </List>


        </InfiniteScroll>
        {this.state.notes.length>10 && this.state.activeItemMenu!='favorite' && this.state.hasMoreItems===false?<Button onClick={this.markAllRead} fluid inverted size='mini'>All read?</Button>:''}
</Container>
      </div>
    );
  }
}

export default App;
