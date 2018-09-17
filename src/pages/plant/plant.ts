import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Items, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage({
  segment: "plant/:id"
})
@Component({
  selector: 'page-plant',
  templateUrl: 'plant.html'
})
export class PlantPage {

  constructor(public navCtrl: NavController, navParams: NavParams, public modalCtrl: ModalController, public items: Items, public api: Api, public utils: Utils) {
    this.items.get(navParams.get('id')).then(item => {
      this.items.currentItem = item  
    });
  }

  edit() {
    this.navCtrl.push('ItemFormPage', { id: this.items.currentItem._id });
  } 

  delete() {
    this.utils.showConfirm(() => {
      this.items.remove(this.items.currentItem);
      this.navCtrl.pop();
    })
  }
}
