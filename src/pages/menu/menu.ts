import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController } from 'ionic-angular';
import { Database } from '../../providers';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[]

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'ContentPage';

  pages: PageList;

  constructor(public navCtrl: NavController, public database: Database) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Sign in', component: 'LoginPage' },
      { title: 'Register', component: 'RegisterPage' }
    ];
  }

  ionViewDidLoad() {
    console.log('Hello MenuPage Page');
  }

  openPage(page: PageItem) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
