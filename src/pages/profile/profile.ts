import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "profile"
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile;
	posts;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {
    if (navParams.get('id')) {
      this.database.get('users', navParams.get('id')).then(res => {
        this.profile = res
        this.loadPosts()
      });
    } else {
      this.profile = this.database.currentUser
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  edit() {
    this.navCtrl.push('ProfileEditPage');
  }

  loadPosts() {
    this.database.query('posts', '', { user: this.profile._id }).then(docs => {
      this.posts = docs
    })
  }

  logout() {
    this.navCtrl.setRoot('WelcomePage');
    this.database.logout()
    // this.menuCtrl.close();
  }

}
