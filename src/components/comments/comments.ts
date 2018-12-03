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
	@Input() item;
	@Input() items;

  message;
  
  constructor(public database: Database) {
    this.message = ''
	}
	
	comment() {
    if (this.item && this.message) {
      let c = { user_id: this.database.currentUser._id, message: this.message, created_at: new Date() }
      if (this.item.comments) {
        this.item.comments.push(c)
      } else {
        this.item.comments = [c]
      }
      this.item['updated_at'] = new Date();

      this.database.put(this.item).then(p => {
        if (this.items) {
          this.items = this.items.map(function(i) { return i._id == p._id ? p : i; });
        } else {
          this.item = p
        }
        this.message = ''
      });
    }
  }
}
