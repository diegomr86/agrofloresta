import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
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
	      category: ['picture', Validators.required],
	      user_id: [user.currentUser._id, Validators.required],
	      _id: ['', Validators.required],
	      _rev: [''],
	      picture: ['', Validators.required],
	      title: ['', Validators.required],
        content: ['', Validators.required],
        created_at: [new Date(), Validators.required],
        url: ['http://herbivora.com.br/o-que-e-agricultura-sintropica/'],
        oembed: [''],
	      tags: [[]]
	    });

      this.loadEmbed()

	    this.form.valueChanges.subscribe((v) => {
	      this.isReadyToSave = this.form.valid;
	    });

      this.api.preview = false

      if (navParams.get('id')) {
        this.edit(navParams.get('id'));
      }
  	}
  }

  generateId() {
    this.form.patchValue({ '_id': slugify(this.form.controls.title.value.toLowerCase()+'-'+new Date().getTime())} )
  }

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      this.form.patchValue({ 'updated_at': new Date()} )
      this.database.save(this.form.value).then(res => {
        this.appCtrl.getRootNav().push('PostPage', { post: res });
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
        this.api.setPreview(post.picture)
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
    this.http.get("http://open.iframe.ly/api/oembed?url="+encodeURI(this.form.controls.url.value)+"&origin=diegomr86").subscribe(
      res => {
        // this.oembed = res;
        if (res) {
          this.form.patchValue({ 'title': res['title'] } )
          this.form.patchValue({ 'content': res['description'] } )
          this.form.patchValue({ 'picture': res['thumbnail_url'] } )
          if (res['html'].indexOf('iframely-embed') > -1) {
            this.api.preview = res['thumbnail_url']
            this.form.patchValue({ 'oembed': undefined } )
          } else {
            this.api.preview = undefined
            this.form.patchValue({ 'oembed': res['html'] } )
          }
        } 

        
        console.log(res);
      }, 
      error =>{
        console.log(error);
      }
    )
    // https://www.youtube.com/watch?v=gSPNRu4ZPvE
  } 


}
