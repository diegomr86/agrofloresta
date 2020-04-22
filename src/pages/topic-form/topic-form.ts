import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-topic-form',
  templateUrl: 'topic-form.html',
})
export class TopicFormPage {
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
      user: [database.currentUser._id, Validators.required],
      _id: [],
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
    this.database.query('topics').then(res => {
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
    this.database.get('topics', id).then((item) => {
      if (item) {
        this.topic = item
        this.form.patchValue({
          ...item
        })
    }}).catch((e) => {});
  }

  delete(topic) {
    this.utils.showConfirm(() => {
      this.database.remove('topics', topic).then(res => {
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

      this.database.save("topics", this.form.value).then(res => {
        if (res) {
          if (!this.form.controls._id.value) {
            this.database.save("comments", { topic: res._id, message: this.form.controls.content.value })
          }
          this.navCtrl.setRoot('ForumPage');
          this.navCtrl.push('TopicPage', { id: res._id });
        }
      })
    })
  }

}
