import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Item } from '../../models/item';
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
    console.log("itemc", this.items.currentItem)
  }

  edit() {
    let addModal = this.modalCtrl.create('ItemCreatePage', { id: this.items.currentItem._id }).present();
  } 

  delete() {
    this.utils.showConfirm(() => {
      this.items.remove(this.items.currentItem);
      this.navCtrl.pop();
    })
  }
}
