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

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api, public user: User) {
  	database.query('post').then(res => {
  		this.posts = res.docs
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

  showComments(post) {
    this.commentPost = post
  }

  
}
