import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
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

  Object = Object;
  isReadyToSave: boolean;
  loading: boolean = false;
  conflict: string;
  additional_fields: FormArray;
  preview: any;

  form: FormGroup;

  errors: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public formBuilder: FormBuilder, public camera: Camera, public items: Items, public api: Api, public utils: Utils, params: NavParams) {
    this.form = formBuilder.group({
      _id: [(params.get('id') || ''), Validators.required],
      _rev: [''],
      picture: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      stratum: [''],
      cycle: [''],
      additional_fields: formBuilder.array([])
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    console.log('ID', params.get('id'));
    if (params.get('id')) {
      this.edit()
    }

    this.items.loadAdditionalFields()
    this.items.additional_fields.forEach((a) => {this.addAdditionalField(a)})
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

  edit() {
    this.items.get(this.form.controls._id.value).then((item) => {
      if (item) {
        this.form.patchValue({
          ...item
        }) 
        this.setPreview(item.picture)
        this.conflict = undefined
    }}).catch((e) => {});
  }

  setPreview(image) {
    this.preview = 'url(' + this.api.url + 'static/thumbs/' + image + ')'
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
          this.setPreview(event.body.url)
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
  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      this.items.save(this.form.value).catch((e) => {
        console.log(e)
        this.utils.showToast(e.message, 'error');
      })
      this.viewCtrl.dismiss();
    })
  }

  addAdditionalField(name?: string) {
    console.log("addaitional", name);
    this.additional_fields = this.form.get('additional_fields') as FormArray;
    if (name) {
      this.additional_fields.push(this.formBuilder.group({
        name: [name, Validators.required],
        content: ['']
      }));        
    } else {
      this.additional_fields.push(this.formBuilder.group({
        name: ['', Validators.required],
        content: ['', Validators.required]
      }));

    }
  } 
}
