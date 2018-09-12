import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-plants',
  templateUrl: 'plants.html'
})
export class PlantsPage {
  itemsList: Item[];
  Object = Object;
  filters;

  constructor(public navCtrl: NavController, public items: Items, public api: Api, public modalCtrl: ModalController) {
    this.items.query('plant', '');     
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
    this.items.query('plant', val, this.filters);     
  }

  /**
   * Prompt the user to add a new item. This shows our ItemFormPage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  add() {
    this.navCtrl.push('ItemFormPage');
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
