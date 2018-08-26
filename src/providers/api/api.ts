import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://ips.diegomr86.ga/';
  loading: boolean = false;
  preview: any;

  constructor(public http: HttpClient) {
  }

  fileUpload(fileItem:File, extraData?:object):any{
    const formData: FormData = new FormData();

    formData.append('image', fileItem, fileItem.name);
    if (extraData) {
      for(let key in extraData){
          // iterate and set other form data
        formData.append(key, extraData[key])
      }
    }

    const req = new HttpRequest('POST', this.url+'images', formData);
    return this.http.request(req)
  }

  setPreview(image) {
    this.preview = 'url(' + this.url + 'static/thumbs/' + image + ')'
  }

  processWebImage(event, form) {
    this.loading = true
    this.fileUpload(event.target.files[0]).subscribe(
      event => {
        if (event.body) {
          this.loading = false
          console.log('s',event)
          this.setPreview(event.body.url)
          form.patchValue({ 'picture': event.body.url });
        }
      }, 
      error =>{
        this.loading = false
        // this.utils.showToast(error, 'error');
      }
    )
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    console.log(this.url + endpoint, reqOpts)
    return this.http.get(this.url + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + endpoint, body, reqOpts);
  }
}
