import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

	post;

	constructor(public navCtrl: NavController, navParams: NavParams, public database: Database, public api: Api, public utils: Utils) {
    this.post = navParams.get('post');
  }

  edit() {
    this.navCtrl.push('PostFormPage', { id: this.post._id });
  } 

}
