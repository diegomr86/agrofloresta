import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;

  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items, public api: Api) {
    this.item = navParams.get('item') || items[0];
    console.log("itemc", this.item)
  }

  delete() {
    this.items.remove(this.item);
    this.navCtrl.pop();
  }
}
