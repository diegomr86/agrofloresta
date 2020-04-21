import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-guide-form',
  templateUrl: 'guide-form.html'
})
export class GuideFormPage {
  @ViewChild('fileInput') fileInput;

  Object = Object;
  isReadyToSave: boolean;
  guide;
  autocompleteTags;

  form: FormGroup;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public database: Database,
    public api: Api,
    public utils: Utils,
    params: NavParams) {

    this.form = formBuilder.group({
      user: [database.currentUser._id, Validators.required],
      _id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[]],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    if (params.get('id')) {
      this.edit(params.get('id'))
    }


    this.autocompleteTags = []
    this.database.query('posts').then(res => {
      if (res) {
        res.forEach((a) => {
          this.autocompleteTags = this.autocompleteTags.concat(a.tags)
        });
        this.autocompleteTags = this.autocompleteTags.map(function(v) {
          return (typeof v == 'string') ? v : v['value'];
        }).filter((v, i, a) => a.indexOf(v) === i).sort()        
      }
    });

  }

  edit(id) {
    this.database.get('guides', id).then((item) => {
      if (item) {
        this.guide = item
        this.form.patchValue({
          ...item
        })
    }})
  }

  delete(guide) {
    this.utils.showConfirm(() => {
      this.database.remove('guides', guide).then(res => {
        this.navCtrl.setRoot('GuidesPage');
      });
    })
  }

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      let tags = this.form.controls.tags.value.map(function(v) {
        return (typeof v == 'string') ? v : v['value'];
      });
      this.form.patchValue({ tags: tags });

      this.database.save('guides', this.form.value).then(res => {
        this.navCtrl.setRoot('GuidesPage');
        this.navCtrl.push('GuidePage', { id: res.id });
      })
    })
  }

}
