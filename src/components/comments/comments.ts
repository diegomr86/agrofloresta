import { Component, Input } from '@angular/core';
import { Database } from '../../providers';

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
  
  constructor(public database: Database) {
    this.message = ''
	}
	
	comment() {
    if (this.post && this.message) {
      let c = { user_id: this.database.currentUser._id, message: this.message, created_at: new Date() }
      if (this.post.comments) {
        this.post.comments.push(c)
      } else {
        this.post.comments = [c]
      }
      this.database.put(this.post).then(p => {
        if (this.posts) {
          this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
        } else {
          this.post = p
        }
        this.message = ''
      });
    }
  }
}
