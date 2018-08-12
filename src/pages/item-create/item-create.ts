import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ToastController } from 'ionic-angular';
import { Items, Api } from '../../providers';
import { Utils } from '../../utils/utils';


@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  loading: boolean = false;

  item: any;
  
  preview: any;

  form: FormGroup;

  errors: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, formBuilder: FormBuilder, public camera: Camera, public items: Items, public api: Api, public utils: Utils) {
    this.form = formBuilder.group({
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

  ionViewDidLoad() {

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
        console.log("Server error")
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
      this.items.create(this.form.value)
      this.viewCtrl.dismiss();
    })
  }

  
}
