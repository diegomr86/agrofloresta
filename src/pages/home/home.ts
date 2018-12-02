import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  quiz_question;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database) {
    
    
    // let that = this
    // this.database.query('plant', '').then(res => {
    //   let empty_fields = [ 'scientific_name', 'stratum', 'cycle', 'harvest_time', 'spacing', 'companion_plants' ]
    //   let empty_field = empty_fields[Math.floor(Math.random()*empty_fields.length)]
    //   console.log('empty_field', empty_field);
    //   console.log('empty_field', res);
    //   res.some(function (plant) {
    //     console.log('plant', empty_field);
    //     console.log('plante', plant[empty_field]);
    //     if (!plant[empty_field] || plant[empty_field] == '' || plant[empty_field] == []) {
    //       that.quiz_question = { field: empty_field, plant: plant };
    //       console.log("question: ", that.quiz_question)    
    //       return true;    
    //     }
    //   });
    // })     

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openPage(page, params?) {
    this.navCtrl.setRoot(page, params);
  }

}
