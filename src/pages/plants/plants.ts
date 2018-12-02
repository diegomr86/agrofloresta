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
  morePlants = [];
  searching;

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController, public http: HttpClient) {
       

    this.filters = {
      cycle: '',
      stratum: '',
    }

    this.searching = false

    this.list();
    // this.populate();

  }

  list(name = '') {
    
    this.database.query('plant', name, this.filters).then(res => {
      this.plants = res.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });

      if (this.plants && this.plants.length > 10) {
        this.morePlants = this.plants.slice(10, this.plants.length+1)
        this.plants = this.plants.slice(0, 10)
      }
    })  
  }

  showMore(infiniteScroll) {
    if (this.morePlants && this.morePlants.length > 0) {
      this.plants = this.plants.concat(this.morePlants.slice(0, 5))            
      this.morePlants = this.morePlants.slice(5, this.morePlants.length+1)
    }
    infiniteScroll.complete();

  }

  search(ev?) {
    this.searching = true

    let val = '';
    if (ev) {
      val = ev.target.value;
    }
    this.list(val);    
  }

  add() {
    this.navCtrl.push('PlantFormPage');
  } 

  open(id) {
    this.navCtrl.push('PlantPage', {
      id: id
    });
  }

}