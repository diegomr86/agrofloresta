import { Component, ViewChild, Input } from '@angular/core';
import { Api } from '../../providers';

/**
 * Generated class for the PictureUploadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'picture-upload',
  templateUrl: 'picture-upload.html'
})
export class PictureUploadComponent {
  @ViewChild('fileInput') fileInput;
  @Input() form;

  preview: any;

  constructor(public api: Api) {
  	console.log("this.form", this.form);
  }

  getPicture() {
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    this.api.processWebImage(event, this.form)
  }

}
