import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Database } from '../../providers';
import { MainPage } from '../../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/register page,
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
            let metadata = { email: user.email, name: user.name, picture: user.picture_large.data.url, facebook_id: user.id }
            this.database.login({ email: user.email, password: user.id }).then((resp) => {
              this.navCtrl.setRoot(MainPage);
            }).catch((e) => {
              metadata['password'] = Math.random().toString(36).slice(-6)
              this.database.register(metadata).then((resp) => {
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
      this.database.register({ type: 'user', email: user.email, name: user.displayName, picture: user.imageUrl, google_id: user.userId }).then((resp) => {
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
    this.database.login({ email: 'convidado@redeagroflorestal.com.br', password: 'agrofloresta'}).then((resp) => {
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch(err => {
      console.error(err)
      this.database.register({ email: 'convidado@redeagroflorestal.com.br', password: 'agrofloresta', name: 'Convidado' }).then((resp) => {
        if (resp) {
          this.navCtrl.setRoot(MainPage);
        }
      })
    })
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }
}
