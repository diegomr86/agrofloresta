import { Component, Input } from '@angular/core';
import { Api } from '../../providers';

@Component({
  selector: 'text-editor',
  templateUrl: 'text-editor.html'
})
export class TextEditorComponent {
  @Input() form;

  editor;
  modules;
  selectLocalImage;

  constructor(public api: Api) {    
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
    content = content.replace(/<img/g,'<img-loader');
    content = content.replace(/<\/img>/g,'</img-loader>');
    content = content.replace(/(<img-loader("[^"]*"|[^\/">])*)>/gi, "$1 useImg></img-loader>")
    return content
  }

}
