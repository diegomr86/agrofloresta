import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Database } from '../../providers';
import { MainPage } from '../../pages';

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

  constructor(public navCtrl: NavController, private fb: Facebook, private googlePlus: GooglePlus, public database: Database) {
  }

  facebookLogin() {

    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.fb.api("me?fields=id,name,email,first_name,picture.width(320).height(320).as(picture_large)", []).then((user) => {
            let metadata = { type: 'user', name: user.name, picture: user.picture_large.data.url, facebook_id: user.id }
            this.database.login(user.email).then((resp) => {
              this.navCtrl.setRoot(MainPage);
            }).catch((e) => {
              this.database.signup(user.email, metadata).then((resp) => {
                if (resp) {
                  this.navCtrl.setRoot(MainPage);
                }
              });
            })
         })
      }).catch(e => console.log('Error logging into Facebook', e));
  }

  googleLogin() {

    this.googlePlus.login()
    .then(user => {
      this.database.signup({ type: 'user', email: user.email, name: user.displayName, picture: user.imageUrl, google_id: user.userId }).then((resp) => {
        this.navCtrl.setRoot(MainPage);
      }).catch((e) => {
        if (e.name == 'conflict') {
          this.database.login(user.email).then((resp) => {
            if (resp) {
              this.navCtrl.setRoot(MainPage);
            }
          });
        }
      })

    }).catch(err => console.error(err));

  }
  login() {
    this.navCtrl.push('LoginPage');
  }

  guest() {
    this.database.login('convidado').then((resp) => {
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch(err => {
      console.error(err)
      this.database.signup('convidado', { name: 'Agrofloresteiro' }).then((resp) => {
        if (resp) {
          this.navCtrl.setRoot(MainPage);
        }
      })
    })
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
