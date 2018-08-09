import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ToastController } from 'ionic-angular';
import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  errors: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, formBuilder: FormBuilder, public camera: Camera, public items: Items) {
    this.form = formBuilder.group({
      picture: [''],
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
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'picture': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'picture': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['picture'].value + ')'
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
    console.log('this.form.value', this.form.value);
    console.log('XXXXX');

    this.items.create(this.form.value).subscribe(r => {
      console.log('XXXXX');
      console.log('XXXXX', r);
      // this.viewCtrl.dismiss(this.form.value)  
    }, (e) => {
      if (e.error.errors) {
        console.log(e  )
        const toast = this.toastCtrl.create({
          message: e.error.errors[0].messages[0],
          duration: 3000
        });
        toast.present();
      }
    });
  }
}
