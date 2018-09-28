import { Component, Input, OnInit } from '@angular/core';
import { User, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent implements OnInit {
  @Input() item;

  user;

  constructor(public navCtrl: NavController, public userDb: User, public api: Api) { }

  ngOnInit() { 
  	this.userDb.get(this.item.user_id).then((user) => {
  		this.user = user;
  	})
  }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }

}
