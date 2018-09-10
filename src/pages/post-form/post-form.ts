import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';
import slugify from 'slugify';


@IonicPage()
@Component({
  selector: 'page-post-form',
  templateUrl: 'post-form.html',
})
export class PostFormPage {

  isReadyToSave: boolean;
  form: FormGroup;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams, 
  	public formBuilder: FormBuilder, 
    public user: User,
    public utils: Utils, 
    public database: Database,
    public api: Api) {
  	
    if (this.user.currentUser) {
	  
      this.form = formBuilder.group({
	      type: ['post', Validators.required],
	      category: ['picture', Validators.required],
	      user_id: [user.currentUser._id, Validators.required],
	      _id: ['', Validators.required],
	      _rev: [''],
	      picture: ['', Validators.required],
	      title: ['', Validators.required],
        content: ['', Validators.required],
        created_at: [new Date(), Validators.required],
	      tags: [[]]
	    });

	    this.form.valueChanges.subscribe((v) => {
        console.log(this.form.value);
	      this.isReadyToSave = this.form.valid;
	    });

      console.log('nav', navParams.get('id'));
      if (navParams.get('id')) {
        this.edit(navParams.get('id'));
      }
  	}
  }

  generateId() {
    console.log(slugify(this.form.controls.title.value.toLowerCase()+'-'+new Date().getTime()));
    this.form.patchValue({ '_id': slugify(this.form.controls.title.value.toLowerCase()+'-'+new Date().getTime())} )
  }

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      this.form.patchValue({ 'updated_at': new Date()} )
      this.database.save(this.form.value).catch((e) => {
        console.log(e)
        this.utils.showToast(e.message, 'error');
      })
    })
  }

  edit(id) {
    this.database.get(id).then((post) => {
      if (post) {
        this.form.patchValue({
          ...post
        }) 
        this.api.setPreview(post.picture)
    }}).catch((e) => {});
  }

}
