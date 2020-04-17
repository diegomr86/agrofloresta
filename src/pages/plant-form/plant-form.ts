import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

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
  autocompleteCompanions;

  form: FormGroup;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public camera: Camera,
    public database: Database,
    public api: Api,
    public utils: Utils,
    params: NavParams) {

    this.form = formBuilder.group({
      user: [database.currentUser._id, Validators.required],
      _id: [''],
      picture: ['', Validators.required],
      name: ['', Validators.required],
      scientific_name: [''],
      description: ['', Validators.required],
      stratum: [''],
      cycle: [''],
      harvest_time: [''],
      spacing: [''],
      companion_plants: [[]],
      additional_fields: formBuilder.array([])
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    if (params.get('id')) {
      this.edit(params.get('id'))
    }

    this.database.loadAdditionalFields('plant').then(res => {
      res.forEach((a) => this.addAdditionalField(a));
    });

    this.autocompleteCompanions = []
    this.database.query('plants').then(res => {
      console.log('res', res);
      res.forEach((a) => this.autocompleteCompanions.push(a.name));
      this.autocompleteCompanions = this.autocompleteCompanions.sort()
    });

    this.api.preview = false

  }

  edit(id) {
    this.database.get('plants', id).then((item) => {
      console.log('item', item);
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
      this.database.remove('plants', plant).then(res => {
        this.navCtrl.setRoot('PlantsPage');
      });
    })
  }

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {

      let companion_plants = this.form.controls.companion_plants.value.map(function(v) {
        return (typeof v == 'string') ? v : v['value'];
      });
      this.form.patchValue({ companion_plants: companion_plants });

      this.database.save('plants', this.form.value).then(res => {
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
