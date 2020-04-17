import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage({
  segment: "post/:id"
})
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

	post;
  tags;

	constructor(public navCtrl: NavController, navParams: NavParams, public database: Database, public api: Api, public utils: Utils) {
    this.database.get('posts', navParams.get('id')).then(res => {
    	this.post = res
      this.tags = this.post.tags.map(function(v) {
        return (typeof v == 'string') ? v : v['value'];
      })
    });

  }

  edit() {
    this.navCtrl.push('PostFormPage', { id: this.post._id });
  }

  open(tag) {
    this.navCtrl.push('FeedPage', { tag: tag });
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
      this.post = p
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
      this.post = p;
    });
  }

}
