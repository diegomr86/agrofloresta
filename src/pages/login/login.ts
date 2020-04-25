import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Database } from '../../providers';
import { Utils } from '../../utils/utils';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  form: FormGroup;
  isReadyToSave: boolean;
  user;

  constructor(public navCtrl: NavController,
    public database: Database,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public utils: Utils) {

    this.form = formBuilder.group({
      email: ['diegomr86@gmail.com', Validators.required],
      password: ['', Validators.required],
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.isReadyToSave = this.form.valid;
  }

  login() {
    this.database.login(this.form.value).then((user) => {
      if (user) {
        if (user.profileCompleted) {
          this.navCtrl.setRoot(MainPage);
        } else {
          this.navCtrl.setRoot('ProfileEditPage');
        }
      }
    }).catch(e => {
      console.log(e)
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

}
