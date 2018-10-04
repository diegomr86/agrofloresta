import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../providers';
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
    public user: User,
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
    this.user.login(this.form.controls.email.value).then((resp) => {
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch((e) => {
      if (e.name == 'not_found') {
        this.utils.showToast('Usuário não encontrado! Por favor cadastre-se.', 'error');
      }
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
