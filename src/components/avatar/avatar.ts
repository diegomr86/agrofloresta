import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'avatar',
  templateUrl: 'avatar.html'
})
export class AvatarComponent {

  @Input() user_id;

  user;

  constructor(public navCtrl: NavController, public database: Database, public api: Api) { }

  ngOnInit() { 
    console.log('user_id', this.user_id);
  	this.database.get(this.user_id).then((user) => {
      console.log('USER:', user);
  		this.user = user;
  	})
  }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }

}
