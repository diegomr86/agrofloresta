import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Database, Api } from '../../providers';

/**
 * Generated class for the ForumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
})
export class ForumPage {

  Object = Object;
  filters;
  topics;
  searching = false;

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController) {

    this.filters = {
      search: '',
      page: 1
    }

    this.list();

  }

  list() {
    this.searching = true
    this.database.query('topics', this.filters).then(res => {
      if (!this.topics) {
        this.topics = []
      }
      this.topics = this.topics.concat(res)
      this.searching = false
    })
  }

  search() {
    this.topics = []
    this.filters.page = 1
    this.list();
  }

  showMore(infiniteScroll) {
    this.filters.page += 1
    this.list()
    infiniteScroll.complete();
  }

  add() {
    this.navCtrl.push('TopicFormPage');
  }

  open(id) {
    this.navCtrl.push('TopicPage', {
      id: id
    });
  }



}
