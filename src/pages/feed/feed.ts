import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  posts;
	morePosts;
  commentPost;
  category;
  tag;
  searching;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {
    this.list();
    this.searching = false
  }

  list() {
    this.posts = []
    this.morePosts = []
    this.category = this.navParams.get('category');
    this.tag = this.navParams.get('tag');
    if (this.category || this.tag) {
      this.searching  = true
    }
    this.database.query('posts', { category: this.navParams.get('category'), tags: this.navParams.get('tag') }).then(res => {
      if (res) {
        let that = this
        console.log('res')
        console.log(res)
        res.forEach(function (post) {
          let likes = post.likes ? post.likes.length : 0
          let dislikes = post.dislikes ? post.dislikes.length : 0
          post.score = that.hotScore(likes, dislikes, post.createdAt);
          that.posts.push(post)
        });
        this.posts = this.posts.sort((a, b) => a.score - b.score).reverse();

        if (this.posts && this.posts.length > 5) {
          this.morePosts = this.posts.slice(5, this.posts.length+1)
          this.posts = this.posts.slice(0, 5)
        }

      } else {
        // setTimeout(() => {
        //   console.log('list: timeout');
        //   this.list();
        // }, 5000);
      }
    });
  }

  showMore(infiniteScroll) {
    if (this.morePosts && this.morePosts.length > 0) {
      this.posts = this.posts.concat(this.morePosts.slice(0, 5))
      this.morePosts = this.morePosts.slice(5, this.morePosts.length+1)
    }
    infiniteScroll.complete();

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
      if (!post.likes.includes(this.database.currentUser._id)) {
        post.likes.push(this.database.currentUser._id)
      } else {
        post.likes = post.likes.filter(like => like !== this.database.currentUser._id)
      }
    } else {
      post.likes = [this.database.currentUser._id]
    }
    this.database.put('posts', post).then(p => {
      this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
    });
  }

  dislike(post) {
    if (post.dislikes) {
      if (!post.dislikes.includes(this.database.currentUser._id)) {
        post.dislikes.push(this.database.currentUser._id)
      } else {
        post.dislikes = post.dislikes.filter(like => like !== this.database.currentUser._id)
      }
    } else {
      post.dislikes = [this.database.currentUser._id]
    }
    this.database.put('posts', post).then(p => {
      this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
    });
  }

  showComments(post) {
    if (post == this.commentPost) {
      delete this.commentPost
    } else {
      this.commentPost = post
    }
  }

  hotScore(ups, downs, date) {
    var s = ups - downs
      , sign = Math.sign(s)
      , order = Math.log(Math.max(Math.abs(s), 1)) / Math.LN10
      , secAge = (Date.now() - new Date(date).getTime()) / 1000;
    return sign*order - secAge / 45000;
  };

}
