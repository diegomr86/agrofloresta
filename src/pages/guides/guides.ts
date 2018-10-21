import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Database, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-guides',
  templateUrl: 'guides.html'
})
export class GuidesPage {
  Object = Object;
  filters;
  guides;
  searching;

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController) {
    this.database.query('guide', '').then(res => {
    	console.log('guides', res);
      this.guides = res;
    })     

    this.filters = {
      cycle: '',
      stratum: '',
    }

    this.searching = false

    // this.populate();

  }

  search(ev?) {
    this.searching = true

    let val = '';
    if (ev) {
      val = ev.target.value;
    }
    this.database.query('guide', val, this.filters).then(docs => {
      this.guides = docs;
    })    
  }

  add() {
    this.navCtrl.push('GuideFormPage');
  } 

  open(id) {
    this.navCtrl.push('GuidePage', {
      id: id
    });
  }

}
