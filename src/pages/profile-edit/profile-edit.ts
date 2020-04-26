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

    // this.translateService.get('REGISTER_ERROR').subscribe((value) => {
    //   this.profile-editublic navCtrl: NavController, pErrorString = value;
    // })

    this.form = formBuilder.group({
      _id: ['', Validators.required],
      email: ['', Validators.required],
      name: ['', Validators.required],
      picture: [''],
      bio: [''],
      phone: [''],
      address: formBuilder.group({
        city: '',
        uf: '',
        street: '',
        neighborhood: '',
        complement: '',
        postal_code: '',
        description: '',
        source: {}
      }),
      roles: ['']
    });

    this.form.valueChanges.subscribe((v) => {
      console.log(this.form.value);
      this.isReadyToSave = this.form.valid;
    });

		this.edit()

    // this.api.preview = false

  }

  edit() {
  	if (this.database.currentUser) {
      console.log('user',this.database.currentUser);
      this.form.patchValue({
        ...this.database.currentUser
      })
      console.log('form', this.form.value);
      this.api.setPreview(this.database.currentUser.picture, 'medium')
    }
  }

  save() {
    this.database.saveProfile(this.form.value).then((response) => {
      this.navCtrl.setRoot('HomePage');
    }).catch((e) => {
      console.log('erro: ', e)
    })
  }
}
