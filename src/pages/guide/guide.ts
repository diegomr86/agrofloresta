import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Api, Database } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html',
})
export class GuidePage {

  form: FormGroup;
  modules;
  selectLocalImage;
  editor;
  guide;
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public user: User, public api: Api, public database: Database, public utils: Utils) {
    this.database.get('basic_guide').then(res => {
    	this.guide = res;
    	console.log('basic', res);
    }).catch (error => {
    	console.log(error);
    	this.edit();
    })
  }

  save() {
    this.utils.showConfirm(() => {
      this.database.save(this.form.value).then(res => {
      	this.guide = res
      	console.log('res', res);
      }).catch((e) => {
        this.utils.showToast(e.message, 'error');
      })
      this.form = undefined;
    })
  }

  edit() {
  	if (this.guide == undefined) {
  		this.guide = {}
  	}
    this.form = this.formBuilder.group({
      type: ['guide', Validators.required],
      user_id: [this.user.currentUser._id, Validators.required],
      _id: ['basic_guide', Validators.required],
      _rev: [this.guide._rev, Validators.required],
      content: [this.guide.content, Validators.required]
    });

	  this.modules = {
	    toolbar: [
			  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			  ['blockquote', 'code-block'],
			  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  [{ 'color': [] }],          // dropdown with defaults from theme
			  [{ 'align': [] }],
			  ['image'],
			  ['clean'],                                         // remove formatting button
			]

	  }

	  this.selectLocalImage = (() => {
	    const input = document.createElement('input');
	    input.setAttribute('type', 'file');
	    input.click();

	    input.onchange = () => {
	      const file = input.files[0];
	      if (/^image\//.test(file.type)) {
	      	this.api.loading = true
	      	this.api.fileUpload(file).subscribe(
			      event => {
			        if (event.body) {
			          this.insertToEditor(event.body.url)
				        this.api.loading = false
			        }
			      }, 
			      error =>{
			      	this.api.loading = false
			        console.log(error);
			      }
			    )
	      } else {
	        console.warn('You could only upload images.');
	      }
	    };
	  }).bind(this);
  }

	getEditorInstance(editorInstance:any) {
	  this.editor = editorInstance;
	  let toolbar = editorInstance.getModule('toolbar');
	  toolbar.addHandler('image', this.selectLocalImage);
	}

  insertToEditor(url: string) {
    // push image url to rich editor.
    const range = this.editor.getSelection();
    this.editor.insertEmbed(range.index, 'image', `${this.api.url}static/${url}`);
  }

  cachedImages(content: string) {
    console.log(content);
    content = content.replace(/<img/g,'<img-loader');
    content = content.replace(/<\/img>/g,'</img-loader>');
    content = content.replace(/(<img-loader("[^"]*"|[^\/">])*)>/gi, "$1 useImg></img-loader>")
    return content
  }
}
