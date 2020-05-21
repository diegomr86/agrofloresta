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
    this.database.query('guides').then(res => {
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

    this.database.query('guides', this.filters).then(docs => {
      this.guides = docs;
    })
  }

  add() {
    if (this.database.currentUser) {
      this.navCtrl.push('GuideFormPage');
    } else {
      this.database.showLogin()
    }
  }

  open(id) {
    this.navCtrl.push('GuidePage', {
      id: id
    });
  }

}
