import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';

/**
 * Generated class for the LibraryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "library/:category"
})
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {
  searching = false;
  filters;
  posts;
	commentPost;
  categories;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: Database, public api: Api) {
    this.filters = {
      category: '',
      tag: '',
      search: '',
      page: 1
    }

    this.categories = { book: 'Livros', video: 'Vídeos', link: 'Artigos', text: 'Textos' }

    if (navParams.get('category')) {
      this.filters.category = navParams.get('category')
    }
    if (navParams.get('tag')) {
      this.filters.tag = navParams.get('tag')
    }

    if (this.filters.category) {
      this.list()
    }
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

  setCategory(category) {
    this.navCtrl.push('LibraryPage', { category: category });
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

  add(category) {
    this.navCtrl.push('PostFormPage', { category: category });
  }
  open(id) {
    this.navCtrl.push('PostPage', { id: id });
  }
}
