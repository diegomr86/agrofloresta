import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ToastController } from 'ionic-angular';
import { Items, Api } from '../../providers';
import { Utils } from '../../utils/utils';
import slugify from 'slugify';


@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  loading: boolean = false;
  conflict: string;

  item: any;
  
  preview: any;

  form: FormGroup;

  errors: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, formBuilder: FormBuilder, public camera: Camera, public items: Items, public api: Api, public utils: Utils) {
    this.form = formBuilder.group({
      _id: ['', Validators.required],
      _rev: [''],
      picture: ['', Validators.required],
      name: ['', Validators.required],
      stratum: [''],
      cycle: [''],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  checkConflict() {
    this.conflict = undefined
    this.form.patchValue({ '_id': slugify(this.form.controls.name.value)} )

    this.items.get(this.form.controls._id.value).then((item) => {
      if (item) {
        this.conflict = this.form.controls._id.value
      }
    }).catch((e) => {});
  }

  edit(id) {
    this.items.get(this.form.controls._id.value).then((item) => {
      if (item) {
        this.form.patchValue({
          ...item
        }) 
        this.conflict = undefined
    }}).catch((e) => {});
  }

  getPicture() {
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    this.loading = true
    this.api.fileUpload(event.target.files[0]).subscribe(
      event => {
        if (event.body) {
          this.loading = false
          console.log('s',event)
          const url = this.api.url + 'static/thumbs/' + event.body.url
          this.preview = 'url(' + url + ')'
          this.form.patchValue({ 'picture': event.body.url });
        }
      }, 
      error =>{
        this.loading = false
        this.utils.showToast(error, 'error');
      }
    )
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  create() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      this.items.create(this.form.value).catch((e) => {
        console.log(e)
        this.utils.showToast(e.message, 'error');
      })
      this.viewCtrl.dismiss();
    })
  }

  
}
