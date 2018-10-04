import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Database, User, Api } from '../../providers';
import { Utils } from '../../utils/utils';
import slugify from 'slugify';


@IonicPage()
@Component({
  selector: 'page-plant-form',
  templateUrl: 'plant-form.html'
})
export class PlantFormPage {
  @ViewChild('fileInput') fileInput;

  Object = Object;
  isReadyToSave: boolean;
  loading: boolean = false;
  additional_fields: FormArray;
  plant;

  form: FormGroup;

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController, 
    public formBuilder: FormBuilder, 
    public camera: Camera, 
    public database: Database, 
    public user: User, 
    public api: Api, 
    public utils: Utils, 
    params: NavParams) {
      
    this.form = formBuilder.group({
      type: ['plant', Validators.required],
      user_id: [user.currentUser._id, Validators.required],
      _id: [''],
      $id: [''],
      picture: ['', Validators.required],
      name: ['', Validators.required],
      scientific_name: [''],
      description: ['', Validators.required],
      stratum: [''],
      cycle: [''],
      harvest_time: [''],
      spacing: [''],
      additional_fields: formBuilder.array([])
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    if (params.get('id')) {
      this.edit(params.get('id'))
    }

    this.database.loadAdditionalFields('plant')
    .then(res => {
      res.forEach((a) => this.addAdditionalField(a));
    });

    this.api.preview = false

  }

  edit(id) {
    this.database.get(id).then((item) => {
      if (item) {
        this.plant = item
        this.form.patchValue({
          ...item
        }) 
        this.api.setPreview(item.picture, 'medium')
    }}).catch((e) => {});
  }

  delete(plant) {
    this.utils.showConfirm(() => {
      this.database.remove(plant).then(res => {
        this.navCtrl.setRoot('PlantsPage');   
      });
    })
  } 

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      this.database.save(this.form.value).then(res => {
        this.navCtrl.setRoot('PlantsPage');
        this.navCtrl.push('PlantPage', { id: res.id });
      }).catch((e) => {
        this.utils.showToast(e.message, 'error');
      })
    })
  }

  addAdditionalField(name?: string) {
    this.additional_fields = this.form.get('additional_fields') as FormArray;
    if (name) {
      let val = this.plant ? this.plant.additional_fields.find(e => e.name == name) : undefined
      this.additional_fields.push(this.formBuilder.group({
        name: [name, Validators.required],
        content: [(val ? val.content: '')]
      }));        
    } else {
      this.additional_fields.push(this.formBuilder.group({
        name: ['', Validators.required],
        content: ['', Validators.required]
      }));

    }
  } 

}
