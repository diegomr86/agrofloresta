import { Component, Input, OnInit } from '@angular/core';
import { User, Api } from '../../providers';

/**
 * Generated class for the UserComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent implements OnInit {
  @Input() item;

  user;

  constructor(public userDb: User, public api: Api) { }

  ngOnInit() { 
  	this.userDb.get(this.item.user_id).then((user) => {
  		this.user = user;
  	})
  	
  }

}
