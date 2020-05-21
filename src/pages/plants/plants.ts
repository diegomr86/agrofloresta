import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Database, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-plants',
  templateUrl: 'plants.html'
})
export class PlantsPage {
  Object = Object;
  filters;
  plants;
  searching = false;

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController, public http: HttpClient) {

    this.filters = {
      cycle: '',
      stratum: '',
      search: '',
      page: 1
    }

    this.list();

  }

  list() {
    this.searching = true
    this.database.query('plants', this.filters).then(res => {
      if (!this.plants) {
        this.plants = []
      }
      this.plants = this.plants.concat(res)
      this.searching = false
    })
  }

  showMore(infiniteScroll) {
    this.filters.page += 1
    this.list()
    infiniteScroll.complete();
  }

  search() {
    this.plants = []
    this.filters.page = 1
    this.list();
  }

  add() {
    if (this.database.currentUser) {
      this.navCtrl.push('PlantFormPage');
    } else {
      this.database.showLogin()
    }
  }

  open(id) {
    this.navCtrl.push('PlantPage', {
      id: id
    });
  }

}
