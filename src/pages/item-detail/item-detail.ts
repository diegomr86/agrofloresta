import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Items, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  constructor(public navCtrl: NavController, navParams: NavParams, public modalCtrl: ModalController, public items: Items, public api: Api, public utils: Utils) {
    this.items.currentItem = navParams.get('item') || items[0];
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
