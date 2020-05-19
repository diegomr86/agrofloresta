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
  searching = false;
  filters;
  posts;
  commentPost;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {

    this.quiz();
    this.searching = true

    this.database.query('posts', { page: 1 }).then(res => {
      this.posts = res
      this.searching = false
    })
  }

  quiz() {
    this.quiz_question = undefined
    this.database.query('quiz/question').then(res => {
      if (res) {
        this.quiz_question = res;
      }
    })
  }

  answer(question, response) {
    let quiz_answer = {
      plant: question.plant._id,
      field: question.field,
      answer: response
    }

    this.database.save('quiz/answer', quiz_answer);

    this.quiz();

  }

  openPage(page, params?) {
    this.navCtrl.setRoot(page, params);
  }

}
