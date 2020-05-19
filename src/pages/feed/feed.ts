import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage({
   segment: "feed/:category/:tag"
 })
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  searching = false;
  filters;
  posts;
	commentPost;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {

    this.filters = {
      category: '',
      tag: '',
      search: '',
      page: 1
    }
    if (navParams.get('category')) {
      this.filters.category = navParams.get('category')
    }
    if (navParams.get('tag')) {
      this.filters.tag = navParams.get('tag')
    }
    this.list();
  }

  list() {
    this.searching = true
    this.database.query('posts', this.filters).then(res => {
      if (!this.posts) {
        this.posts = []
      }
      this.posts = this.posts.concat(res)
      this.searching = false
    })
  }

  showMore(infiniteScroll) {
    this.filters.page += 1
    this.list()
    infiniteScroll.complete();
  }

  search() {
    this.posts = []
    this.filters.page = 1
    this.list();
  }

  add() {
    this.navCtrl.push('PostFormPage', { category: this.filters.category });
  }

  // hotScore(ups, downs, date) {
  //   var s = ups - downs
  //     , sign = Math.sign(s)
  //     , order = Math.log(Math.max(Math.abs(s), 1)) / Math.LN10
  //     , secAge = (Date.now() - new Date(date).getTime()) / 1000;
  //   return sign*order - secAge / 45000;
  // };

}
