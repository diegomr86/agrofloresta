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
      type: ['user', Validators.required],
      email: ['', Validators.required],
      name: ['', Validators.required],
      picture: [''],
      bio: [''],
      location: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.api.preview = false

  }

  doSignup() {
    console.log('signup resp', this.form.value);

    // Attempt to login in through our User service
    this.database.signup(this.form.value).then((response) => {
      this.navCtrl.setRoot(MainPage);
    }).catch((e) => {
      console.log('signup error', e);
      if (e.name == 'conflict') {
        this.utils.showToast("Usuário já cadastrado. Fazendo login.", 'primary');
        // this.login();

      }
    })
  }

  login() {
    this.database.login(this.form.controls.email.value).then((resp) => {
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
