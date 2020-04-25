import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'posts',
  templateUrl: 'posts.html'
})
export class PostsComponent {
  @Input() posts;
  commentPost;

  constructor(public navCtrl: NavController, public database: Database, public api: Api) {
  }

  open(id) {
    this.navCtrl.push('PostPage', { id: id });
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
}
