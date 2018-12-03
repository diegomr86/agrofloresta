import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

/**
 * Generated class for the TopicFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-topic-form',
  templateUrl: 'topic-form.html',
})
export class TopicFormPage {
  @ViewChild('fileInput') fileInput;

  Object = Object;
  isReadyToSave: boolean;
  topic;
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
      type: ['topic', Validators.required],
      user_id: [database.currentUser._id, Validators.required],
      _id: [''],
      $id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[]],
      comments: [[]],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    if (params.get('id')) {
      this.edit(params.get('id'))
    }


    this.autocompleteTags = []
    this.database.query('topic').then(res => {
      res.forEach((a) => {
        this.autocompleteTags = this.autocompleteTags.concat(a.tags)
      });
      this.autocompleteTags = this.autocompleteTags.map(function(v) {
        return (typeof v == 'string') ? v : v['value'];
      }).filter((v, i, a) => a.indexOf(v) === i).sort()
    });

  }

  edit(id) {
    this.database.get(id).then((item) => {
      if (item) {
        this.topic = item
        this.form.patchValue({
          ...item
        }) 
    }}).catch((e) => {});
  }

  delete(topic) {
    this.utils.showConfirm(() => {
      this.database.remove(topic).then(res => {
        this.navCtrl.setRoot('ForumPage');   
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

      if (!this.form.controls._id) {
        this.form.patchValue({ comments: [{ user_id: this.database.currentUser._id, message: this.form.controls.content.value, created_at: new Date() }] });
      }

      console.log('this.form.value', this.form.value);
      this.database.save(this.form.value).then(res => {
        this.navCtrl.setRoot('ForumPage');
        this.navCtrl.push('TopicPage', { id: res.id });
      }).catch((e) => {
        this.utils.showToast(e.message, 'error');
      })
    })
  }
  
}
