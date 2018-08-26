import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../providers';
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
    public formBuilder: FormBuilder) {

    this.form = formBuilder.group({
      _id: ['diegomr86@gmail.com', Validators.required]
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.isReadyToSave = this.form.valid;
  }

  login() {
    this.user.login(this.form.controls._id.value).then((resp) => {
      console.log(resp);
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
