import { Component, Input } from '@angular/core';
import { Database, User } from '../../providers';

/**
 * Generated class for the CommentsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'comments',
  templateUrl: 'comments.html'
})
export class CommentsComponent {
	@Input() post;
	@Input() posts;

  message;
  
  constructor(public database: Database, public user: User) {
    this.message = ''
	}
	
	comment() {
    if (this.post && this.message) {
      let c = { user_id: this.user.currentUser._id, message: this.message, created_at: new Date() }
      if (this.post.comments) {
        this.post.comments.push(c)
      } else {
        this.post.comments = [c]
      }
      this.database.save(this.post).then(p => {
        this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
        this.message = ''
      });
    }
  }
}
