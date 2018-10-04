import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api, User } from '../../providers';

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
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api, public user: User) {
    if (navParams.get('id')) {
      this.database.get(navParams.get('id')).then(res => {
        this.profile = res
        this.loadPosts()
      });      
    } else {
      this.profile = this.user.currentUser
      this.loadPosts()
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  edit() {
    this.navCtrl.push('ProfileEditPage');
  }

  loadPosts() {
    this.database.query('post', '', { user_id: this.profile._id }).then(docs => {
      this.posts = docs
    })

  }

}
