import { Component, Input } from '@angular/core';
import { Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {
  @Input() item;

  constructor(public navCtrl: NavController, public api: Api) { }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }

}
