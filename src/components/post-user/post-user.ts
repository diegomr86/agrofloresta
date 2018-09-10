import { Component, Input, OnInit } from '@angular/core';
import { User, Api } from '../../providers';

/**
 * Generated class for the PostUserComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post-user',
  templateUrl: 'post-user.html'
})
export class PostUserComponent {
  @Input() post;

  user;

  constructor(public userDb: User, public api: Api) { }

  ngOnInit() { 
  	this.userDb.get(this.post.user_id).then((user) => {
  		this.user = user;
  	})
  	
  }


}
