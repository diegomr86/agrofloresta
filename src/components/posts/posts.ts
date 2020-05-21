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

  openTag(tag) {
    this.navCtrl.push('FeedPage', { tag: tag });
  }

  likeIcon(post) {
    var userLike = null
    if (this.database.currentUser) {
      userLike = post.likes.find(l => l.user == this.database.currentUser._id)
    }
    if (userLike) {
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

  postTags(post) {
    return post.tags.map(function(v) {
      return (typeof v == 'string') ? v : v['value'];
    })
  }

  like(post) {
    if (this.database.currentUser) {
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
      }
    } else {
      this.database.showLogin()
    }
  }
}
