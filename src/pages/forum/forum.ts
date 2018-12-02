import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Database, Api } from '../../providers';

/**
 * Generated class for the ForumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
})
export class ForumPage {

  Object = Object;
  filters;
  topics;
  searching;

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController) {
    this.database.query('topic', '').then(res => {
    	console.log('topics', res);
      this.topics = res;
    })     

    this.filters = {
      cycle: '',
      stratum: '',
    }

    this.searching = false

  }

  search(ev?) {
    this.searching = true

    let val = '';
    if (ev) {
      val = ev.target.value;
    }
    this.database.query('topic', val, this.filters).then(docs => {
      this.topics = docs;
    })    
  }

  add() {
    this.navCtrl.push('TopicFormPage');
  } 

  open(id) {
    this.navCtrl.push('TopicPage', {
      id: id
    });
  }



}
