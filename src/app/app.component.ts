import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController } from 'ionic-angular';

import { FirstRunPage, MainPage } from '../pages';
import { Settings, User, Api } from '../providers';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  template: `<ion-split-pane>
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar>
          <ion-title *ngIf="this.user.currentUser">
            Agrofloresta!
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-list>
          <ion-item *ngIf="this.user.currentUser">
            <ion-avatar item-start>
              <img [src]="(this.user.currentUser.picture && this.user.currentUser.picture.startsWith('http')) ? this.user.currentUser.picture : this.api.url + 'static/thumbs/'+ this.user.currentUser.picture">
            </ion-avatar>
            <h2 (click)="this.logout()">{{this.user.currentUser.name}}</h2>
            <p>{{this.user.currentUser._id}}</p>
          </ion-item>
          <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
            {{p.title}}
          </button>
          <button menuClose ion-item (click)="this.logout()">
            Sair
          </button>
        </ion-list>
      </ion-content>

    </ion-menu>
    <ion-nav #content main [root]="rootPage"></ion-nav>
  </ion-split-pane>`
})
export class MyApp {
  rootPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Plantas', component: 'ListMasterPage' },
    { title: 'Guia básico', component: 'GuidePage' },
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
  ]
  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, private user: User, public api: Api, public menuCtrl: MenuController, public storage: Storage, private geolocation: Geolocation) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();


    });
    
    this.initTranslate();

    this.storage.get('currentPosition').then((p) => {
      console.log('p', p);
      if (!p) {
        console.log('pp', p);
        this.geolocation.getCurrentPosition().then((position) => {
          console.log('locationn', position);
          this.storage.set('currentPosition', position).catch((e) => {
            console.log('errr', e);
          })
        }).catch((error) => {
          console.log('Error getting location', error);
        });          
      }
    })

    this.user.skipTour().then((skipTour) => {
      if (skipTour) {
        this.user.getCurrentUser().then((r) => {
          if (r) {
            this.rootPage = MainPage
          } else {
            this.rootPage = FirstRunPage
          }
        })

      } else {
        this.rootPage = 'TutorialPage'
      }
    });

    console.log('currentUser: ', this.user.currentUser);


  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('pt-br');
    // const browserLang =  this.translate.getBrowserLang();
    const browserLang = false;

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('pt-br'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  logout() {
    this.user.logout()
    this.nav.setRoot('WelcomePage');   
    // this.menuCtrl.close(); 
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
