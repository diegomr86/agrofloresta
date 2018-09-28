import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController) {
    this.database.query('plant', '').then(res => {
      this.plants = res.docs;
    })     

    this.filters = {
      cycle: '',
      stratum: '',
    }

  }

  search(ev?) {
    let val = '';
    if (ev) {
      val = ev.target.value;
    }
    this.database.query('plant', val, this.filters).then(res => {
      this.plants = res.docs;
    })    
  }

  /**
   * Prompt the user to add a new item. This shows our PlantFormPage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  add() {
    this.navCtrl.push('PlantFormPage');
  } 

  /**
   * Navigate to the detail page for this item.
   */
  open(id) {
    this.navCtrl.push('PlantPage', {
      id: id
    });
  }
}
