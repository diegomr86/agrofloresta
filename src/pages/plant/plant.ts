import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage({
  segment: "plant/:id"
})
@Component({
  selector: 'page-plant',
  templateUrl: 'plant.html'
})
export class PlantPage {

  plant;

  constructor(public navCtrl: NavController, navParams: NavParams, public database: Database, public api: Api, public utils: Utils) {
    this.database.get(navParams.get('id')).then(res => {
      console.log('res', res);
      this.plant = res
    });
  }

  edit() {
    this.navCtrl.push('PlantFormPage', { id: this.plant._id });
  } 

}
