import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';

@Component({
  selector: 'comment-user',
  templateUrl: 'comment-user.html'
})
export class CommentUserComponent {
  @Input() comment;
  @Input() post;
  @Input() posts;

  user;

  constructor(public database: Database, public api: Api) { }

  ngOnInit() { 
  	this.database.get(this.comment.user_id).then((u) => {
  		this.user = u;
  	})
  	
  }

  delete(){
    if (this.comment.user_id == this.database.currentUser._id) {
      this.post.comments = this.post.comments.filter(c => c !== this.comment)

      this.database.put(this.post).then(p => {
        if (this.posts) {
          this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
        } else {
          this.post = p
        }
      });
    } 

  }

}
