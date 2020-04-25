import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Database } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  form: FormGroup;
  isReadyToSave: boolean;
  msg;
  user;

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

  forgotPassword() {
    this.database.forgotPassword(this.form.controls.email.value).then((user) => {
      if (user) {
        this.msg = "Um email com sua nova senha foi eviado para o endereço: "+this.form.controls.email.value
      }
    });
  }

  back() {
    this.navCtrl.push('LoginPage');
  }

}
