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

  user;

  constructor(public database: Database, public api: Api) { }

  ngOnInit() { 
  	this.database.getUser(this.comment.user_id).then((u) => {
  		this.user = u;
  	})
  	
  }

  delete(){
    if (this.comment.user_id == this.database.currentUser._id) {
      this.item.comments = this.item.comments.filter(c => c !== this.comment)

      this.database.put(this.item).then(p => {
        if (this.items) {
          this.items = this.items.map(function(item) { return item._id == p._id ? p : item; });
        } else {
          this.item = p
        }
      });
    } 

  }

}
