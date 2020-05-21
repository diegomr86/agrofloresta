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
    if (this.database.currentUser) {
      this.navCtrl.push('PostFormPage', { id: this.post._id });
    } else {
      this.database.showLogin()
    }
  }

  open(tag) {
    this.navCtrl.push('FeedPage', { tag: tag });
  }

  openTag(tag) {
    this.navCtrl.push('FeedPage', { tag: tag });
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

  likeIcon(post) {
    if (this.userLike(post)) {
      return 'ios-thumbs-up'
    } else {
      return 'ios-thumbs-up-outline'
    }
  }
  likeDescription(post) {
    var qtd = null
    if (post.likes && post.likes.length > 0) {
      var like = this.userLike(post)
      if (like) {
        if (post.likes.length == 1) {
          return 'Você curtiu!'
        } else {
          qtd = (post.likes.length - 1)
          if (qtd == 1) {
            return 'Você e outra pessoa curtiram'
          } else {
            return 'Você + ' + qtd + ' pessoas curtiram'
          }
        }
      } else {
        qtd = post.likes.length
        if (qtd == 1) {
          return 'Uma pessoa curtiu'
        } else {
          return qtd + ' pessoas curtiram'
        }
      }
    } else {
      return 'Seja o primeiro a curtir'
    }
  }
  userLike(post) {
    if (this.database.currentUser) {
      return post.likes.find(l => l.user == this.database.currentUser._id)
    }
  }

}
