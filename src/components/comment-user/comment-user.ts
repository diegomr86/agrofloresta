import { Component, Input } from '@angular/core';
import { Database, User, Api } from '../../providers';

@Component({
  selector: 'comment-user',
  templateUrl: 'comment-user.html'
})
export class CommentUserComponent {
  @Input() comment;
  @Input() post;
  @Input() posts;

  user;

  constructor(public database: Database, public userDb: User, public api: Api) { }

  ngOnInit() { 
  	this.database.get(this.comment.user_id).then((u) => {
  		this.user = u;
  	})
  	
  }

  delete(){
    if (this.comment.user_id == this.userDb.currentUser._id) {
      this.post.comments = this.post.comments.filter(c => c !== this.comment)

      this.database.save(this.post).then(p => {
        this.posts = this.posts.map(function(item) { return item._id == p._id ? p : item; });
      });
    } 

  }

}
