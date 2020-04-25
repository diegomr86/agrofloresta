import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Api, Database } from '../../providers';
import { Utils } from '../../utils/utils';

import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  form: FormGroup;
  isReadyToSave: boolean;
  errors: boolean;

  // Our translated text strings
  // private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public api: Api,
    public database: Database,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public translateService: TranslateService,
    public utils: Utils) {

    // this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
    //   this.signupublic navCtrl: NavController, pErrorString = value;
    // })

    this.form = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.api.preview = false

  }

  doSignup() {
    this.errors = null
    this.database.signup(this.form.value).then((user) => {
      if (user && user._id) {
        this.navCtrl.setRoot('ProfileEditPage');
      }
    }).catch(e => {
      this.errors = e.error.errors
      if (e.status == 422) {
        this.utils.showToast("Verifique os erros antes de continuar", "error")
      } else {
        this.utils.showToast(e.message, "error")
      }
    })
  }
}
