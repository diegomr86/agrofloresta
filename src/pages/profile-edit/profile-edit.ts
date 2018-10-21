import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Api, Database } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html'
})
export class ProfileEditPage {

  form: FormGroup;
  isReadyToSave: boolean;

  // Our translated text strings
  // private profile-editErrorString: string;

  constructor(public navCtrl: NavController,
    public api: Api,
    public database: Database,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder, 
    public translateService: TranslateService,
    public utils: Utils) {

    // this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
    //   this.profile-editublic navCtrl: NavController, pErrorString = value;
    // })

    this.form = formBuilder.group({
      type: ['user', Validators.required],
      _id: ['', Validators.required],
      _rev: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      picture: [''],
      bio: [''],
      location: ['']
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

		this.edit()

    // this.api.preview = false

  }

  edit() {
  	if (this.database.currentUser) {
      this.form.patchValue({
        ...this.database.currentUser
      }) 
      this.api.setPreview(this.database.currentUser.picture, 'medium')
    }
  }

  save() {
    // Attempt to login in through our User service
    this.database.saveProfile(this.form.value).then((response) => {
      this.navCtrl.setRoot('ProfilePage');
      // this.database.login(this.database.currentUser._id).then(res => this.navCtrl.setRoot('ProfilePage'));
    }).catch((e) => {
      console.log('erro: ', e)
    })
  }
}
