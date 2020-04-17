import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'post-user',
  templateUrl: 'post-user.html'
})
export class PostUserComponent {
  @Input() post;

  constructor(public navCtrl: NavController, public database: Database, public api: Api) { }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }


}
