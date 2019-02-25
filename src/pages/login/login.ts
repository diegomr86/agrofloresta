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

  constructor(public navCtrl: NavController,
    public database: Database,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public utils: Utils) {

    this.form = formBuilder.group({
      email: ['', Validators.required]
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.isReadyToSave = this.form.valid;
  }

  login() {
    this.database.login(this.form.controls.email.value).then((resp) => {
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch((e) => {
      console.log('login error', e);
      console.log('login error: ' + JSON.stringify(e));

      if (e.name == 'not_found') {
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
    this.database.signup(this.form.controls.email.value).then((response) => {
      this.navCtrl.setRoot(MainPage);
    }).catch((e) => {
      console.log('signup error', e);
      this.utils.showToast('Erro: '+JSON.stringify(e), 'error');
    })
  }

}
