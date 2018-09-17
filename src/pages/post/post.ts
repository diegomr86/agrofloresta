import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage({
  segment: "post/:id"
})
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

	post;

	constructor(public navCtrl: NavController, navParams: NavParams, public database: Database, public api: Api, public utils: Utils) {
    this.database.get(navParams.get('id')).then(res => {
    	this.post = res
    });
  }

  edit() {
    this.navCtrl.push('PostFormPage', { id: this.post._id });
  } 

}
