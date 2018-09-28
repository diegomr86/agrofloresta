import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api, User } from '../../providers';

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
  commentPost;
  category;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api, public user: User) {
    this.posts = []
    this.category = navParams.get('category');
    database.query('post', '', { category: navParams.get('category') }).then(res => {
      let that = this
      res.docs.forEach(function (post) {
        let likes = post.likes ? post.likes.length : 0
        let dislikes = post.dislikes ? post.dislikes.length : 0
        post.score = that.hotScore(likes, dislikes, post.created_at);
        that.posts.push(post)  
      });
  		this.posts = this.posts.sort((a, b) => a.score < b.score);
  	})
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
      if (!post.likes.includes(this.user.currentUser._id)) {
        post.likes.push(this.user.currentUser._id)
      } else {
        post.likes = post.likes.filter(like => like !== this.user.currentUser._id)
      }
    } else {
      post.likes = [this.user.currentUser._id]
    }
    this.database.save(post).then(p => {
      this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
    });
  }

  dislike(post) {
    if (post.dislikes) {
      if (!post.dislikes.includes(this.user.currentUser._id)) {
        post.dislikes.push(this.user.currentUser._id)
      } else {
        post.dislikes = post.dislikes.filter(like => like !== this.user.currentUser._id)
      }
    } else {
      post.dislikes = [this.user.currentUser._id]
    }
    this.database.save(post).then(p => {
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
