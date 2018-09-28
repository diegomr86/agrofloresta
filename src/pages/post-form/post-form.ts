import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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
  oembed;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams, 
    public appCtrl: App, 
  	public formBuilder: FormBuilder, 
    public user: User,
    public utils: Utils, 
    public database: Database,
    public api: Api,
    public http: HttpClient) {
  	
    if (this.user.currentUser) {
	  
      this.form = formBuilder.group({
	      type: ['post', Validators.required],
	      category: ['', Validators.required],
	      user_id: [user.currentUser._id, Validators.required],
	      _id: ['', Validators.required],
	      _rev: [''],
	      picture: [''],
	      title: ['', Validators.required],
        content: ['', Validators.required],
        created_at: [new Date(), Validators.required],
        url: [''],
        oembed: [''],
        start_time: [''],
        end_time: [''],
        location: [''],
	      tags: [[]]
	    });

      this.loadEmbed()

      this.form.valueChanges.subscribe((v) => {
        this.isReadyToSave = this.form.valid;
      });

	    this.form.controls.title.valueChanges.subscribe((v) => {
        this.generateId();
	    });

      this.api.preview = false

      if (navParams.get('id')) {
        this.edit(navParams.get('id'));
      }
  	}
  }

  generateId() {
    if (!this.form.controls._rev.value) {
      this.form.patchValue({ '_id': slugify(this.form.controls.title.value.toLowerCase()+'-'+new Date().getTime())} )
    }
  }

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      this.form.patchValue({ 'updated_at': new Date()} )
      this.database.save(this.form.value).then(res => {
        this.navCtrl.setRoot('FeedPage');
        this.navCtrl.push('PostPage', { id: this.form.controls._id.value });
      }).catch((e) => {
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
        this.api.setPreview(post.picture, 'medium')
    }}).catch((e) => {});
  }

  delete(post) {
    this.utils.showConfirm(() => {
      this.database.remove(post).then(res => {
        this.navCtrl.setRoot('FeedPage');   
      });
    })
  } 

  loadEmbed() {
    delete this.api.preview;
    if (this.form.controls.url.value) {
      this.http.get("http://open.iframe.ly/api/oembed?url="+encodeURI(this.form.controls.url.value)+"&origin=diegomr86").subscribe(
        res => {
          // this.oembed = res;
          if (res) {
            this.form.patchValue({ 'title': res['title'] } )
            this.form.patchValue({ 'content': res['description'] } )
            if (res['thumbnail_url']) {
              this.form.patchValue({ 'picture': { url: res['thumbnail_url'] } } )
            }
            if (res['type'] == 'video') {
              this.form.patchValue({ 'category': 'video' } )
            }
            if (!res['html'] || res['html'].indexOf('iframely-embed') > -1) {
              if (res['thumbnail_url']) {
                this.api.setPreview(res['thumbnail_url']);
              }
              this.form.patchValue({ 'oembed': undefined } )
            } else {
              this.form.patchValue({ 'oembed': res['html'] } )
            }
          }         
        }, 
        error =>{
          console.log('oembed error:', error);
        }
      )
      // https://www.youtube.com/watch?v=gSPNRu4ZPvE
    }
  } 

  setCategory(category) {
    this.form.patchValue({ category: category}) 
  }

}
