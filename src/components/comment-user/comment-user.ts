import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';

@Component({
  selector: 'comment-user',
  templateUrl: 'comment-user.html'
})
export class CommentUserComponent {
  @Input() comment;
  @Input() item;
  @Input() items;
  @Input() item_type;

  constructor(public database: Database, public api: Api) { }

  ngOnInit() {
  }

  delete(){
    if (this.comment.user._id == this.database.currentUser._id) {
      this.item.comments = this.item.comments.filter(c => c !== this.comment)

      this.database.put(this.item_type, this.item).then(p => {
        if (this.items) {
          this.items = this.items.map(function(item) { return item._id == p._id ? p : item; });
        } else {
          this.item = p
        }
      });
    }

  }

}
