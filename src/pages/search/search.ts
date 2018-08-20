import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items) { }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.items.query("");
      return; 
    }
    this.items.query(val);
  }

  /**
   * Navigate to the detail page for this item.
   */
  open(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

}
