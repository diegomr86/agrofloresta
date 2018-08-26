import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { User } from '../../providers';
import { FirstRunPage, MainPage } from '../../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, private fb: Facebook, public user: User) {
  }

  facebookLogin() {

    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => { 
        console.log('Logged into Facebook!', res)
        this.fb.api("me?fields=id,name,email,first_name,picture.width(320).height(320).as(picture_large)", []).then((user) => {
          console.log('user', user)
            this.user.signup({ type: 'user', _id: user.email, name: user.name, picture: user.picture_large.data.url, facebook_id: user.id }).then((resp) => {
              this.navCtrl.setRoot(MainPage);
            }).catch((e) => {
              if (e.name == 'conflict') {
                this.user.login(user.email).then((resp) => {
                  console.log(resp);
                  if (resp) {
                    this.navCtrl.setRoot(MainPage);
                  }
                });
              }
            })
         })
      }).catch(e => console.log('Error logging into Facebook', e));

  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
