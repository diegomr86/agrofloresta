import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  Object = Object;
  quiz_question;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {

    this.quiz();
  }

  quiz() {
    this.quiz_question = undefined
    let that = this
    this.database.query('plants', '').then(res => {
      // let empty_fields = [ 'stratum', 'cycle', 'harvest_time', 'spacing', 'companion_plants' ]
      let empty_fields = [ 'stratum', 'cycle' ]
      let empty_field = empty_fields[Math.floor(Math.random()*empty_fields.length)]
      res.sort(function() { return 0.5 - Math.random() })
      res.some(function (plant) {
        // if (!plant[empty_field] || plant[empty_field] == '' || plant[empty_field] == []) {
          that.quiz_question = { field: empty_field, plant: plant._id };
          return true;
        // }
      });
    })
  }

  answer(question, response) {
    let quiz_answer = {
      type: 'quiz_answer',
      user: this.database.currentUser._id,
      plant: question.plant._id,
      field: question.field,
      answer: response
    }

    this.database.save('quiz_answers', quiz_answer);

    this.quiz();

  }

  openPage(page, params?) {
    this.navCtrl.setRoot(page, params);
  }

}
