import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

/**
 * Generated class for the LibraryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "library/:category"
})
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {

  posts;
	morePosts;
  commentPost;
  category;
  tag;
  searching;
  categories;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {
    this.list();
    this.searching = false
    this.categories = { book: 'Livros', video: 'Vídeos', link: 'Artigos', text: 'Textos' }
  }

  list() {
    console.log('list! ');
    this.posts = []
    this.morePosts = []
    this.category = this.navParams.get('category');
    this.tag = this.navParams.get('tag');
    console.log('list: cat'+JSON.stringify(this.category));
    console.log('list: tag'+JSON.stringify(this.tag));
    if (this.category || this.tag) {
      this.searching  = true
    }
    console.log('list: query!');
    this.database.query('post', '', { category: this.navParams.get('category'), tags: this.navParams.get('tag') }).then(res => {
      console.log('list: res'+JSON.stringify(res));
      if (res && res.length > 0) {
        let that = this
        res.forEach(function (post) {
          let likes = post.likes ? post.likes.length : 0
          let dislikes = post.dislikes ? post.dislikes.length : 0
          post.score = that.hotScore(likes, dislikes, post.created_at);
          that.posts.push(post) 
          console.log('list: post'+JSON.stringify(post)); 
        });
        this.posts = this.posts.sort((a, b) => a.score - b.score).reverse();

        if (this.posts && this.posts.length > 5) {
          this.morePosts = this.posts.slice(5, this.posts.length+1)
          this.posts = this.posts.slice(0, 5)
        }

        console.log('list: post'+JSON.stringify(this.posts));
      } else {
        // setTimeout(() => {
        //   console.log('list: timeout');
        //   this.list();
        // }, 5000);
      }
    }).catch(e => {
      console.log('list: error'+JSON.stringify(e));
    });
  }

  setCategory(category) {
    this.navCtrl.push('LibraryPage', { category: category });
  }

  showMore(infiniteScroll) {
    if (this.morePosts && this.morePosts.length > 0) {
      this.posts = this.posts.concat(this.morePosts.slice(0, 5))            
      this.morePosts = this.morePosts.slice(5, this.morePosts.length+1)
    }
    infiniteScroll.complete();

  }

  add(category) {
    this.navCtrl.push('PostFormPage', { category: category });
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
    this.database.put(post).then(p => {
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
    this.database.put(post).then(p => {
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
