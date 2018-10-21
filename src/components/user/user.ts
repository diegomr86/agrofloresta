import { Component, Input, OnInit } from '@angular/core';
import { Database, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent implements OnInit {
  @Input() item;

  user;

  constructor(public navCtrl: NavController, public database: Database, public api: Api) { }

  ngOnInit() { 
  	this.database.get(this.item.user_id).then((user) => {
  		this.user = user;
  	})
  }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }

}
