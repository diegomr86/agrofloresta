import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage({
   segment: "feed/:category"
 })
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  searching = false;
  filters;
  posts;
	commentPost;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {

    this.filters = {
      category: '',
      tag: '',
      search: '',
      page: 1
    }
    if (navParams.get('category')) {
      this.filters.category = navParams.get('category')
    }
    if (navParams.get('tag')) {
      this.filters.tag = navParams.get('tag')
    }
    this.list();
  }

  list() {
    this.searching = true
    this.database.query('posts', this.filters).then(res => {
      if (!this.posts) {
        this.posts = []
      }
      this.posts = this.posts.concat(res)
      this.searching = false
    })
  }

  showMore(infiniteScroll) {
    this.filters.page += 1
    this.list()
    infiniteScroll.complete();
  }

  search() {
    this.posts = []
    this.filters.page = 1
    this.list();
  }

  add() {
    this.navCtrl.push('PostFormPage');
  }

  edit(id) {
    this.navCtrl.push('PostFormPage', { id: id });
  }

  open(id) {
    this.navCtrl.push('PostPage', { id: id });
  }

  like(post) {
    if (post.likes) {
      var like = post.likes.find(l => l.user == this.database.currentUser._id)
      if (like) {
        this.database.remove('likes', like).then(p => {
          post.likes = post.likes.filter(l => l.user !== this.database.currentUser._id)
        });
      } else {
        this.database.save('likes', { post: post._id }).then(l => {
          post.likes.push(l)
        });
      }
    } else {
      post.likes = [this.database.currentUser._id]
    }

  }

  likeIcon(post) {
    var like = post.likes.find(l => l.user == this.database.currentUser._id)
    if (like) {
      return 'ios-thumbs-up'
    } else {
      return 'ios-thumbs-up-outline'
    }
  }
  showComments(post) {
    if (post == this.commentPost) {
      delete this.commentPost
    } else {
      this.commentPost = post
    }
  }

  // hotScore(ups, downs, date) {
  //   var s = ups - downs
  //     , sign = Math.sign(s)
  //     , order = Math.log(Math.max(Math.abs(s), 1)) / Math.LN10
  //     , secAge = (Date.now() - new Date(date).getTime()) / 1000;
  //   return sign*order - secAge / 45000;
  // };

}
