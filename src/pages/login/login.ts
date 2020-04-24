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
      password: ['']
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.isReadyToSave = this.form.valid;
  }

  loadUser() {
    this.database.loadUser(this.form.controls.email.value).then((user) => {
      if (user) {
        this.user = user
      }
    }).catch((e) => {
      if (e.status == 422 && this.form.controls.email.value) {
        this.doSignup();
      } else {
        this.utils.showToast('Erro: '+JSON.stringify(e), 'error');
      }
    });
  }

  login() {
    this.database.login(this.form.controls.email.value).then((user) => {
      if (user) {
        if (user.profileCompleted) {
          this.navCtrl.setRoot(MainPage);
        } else {
          this.navCtrl.setRoot('ProfileEditPage');
        }
      }
    }).catch((e) => {
      console.log(e)
      if (e.status == 422 && this.form.controls.email.value) {
        this.doSignup();
      } else {
        this.utils.showToast('Erro: '+JSON.stringify(e), 'error');
      }
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  doSignup() {
    this.database.signup(this.form.controls.email.value).then((user) => {
      if (user) {
        if (user.profileCompleted) {
          this.navCtrl.setRoot(MainPage);
        } else {
          this.navCtrl.setRoot('ProfileEditPage');
        }
      }

    }).catch((e) => {
      console.log('signup error', e);
      this.utils.showToast('Erro: '+JSON.stringify(e), 'error');
    })
  }

}
