import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController } from 'ionic-angular';

import { FirstRunPage, MainPage } from '../pages';
import { Settings, User, Api } from '../providers';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { ImgCacheService } from '../global';

@Component({
  template: `<ion-split-pane [enabled]="this.user.currentUser">
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons left>
            <button ion-button icon-only menuToggle *ngIf="!form">
              <img src="assets/img/logo_white.png" style="width: 40px;">
            </button>
          </ion-buttons>

          <ion-title *ngIf="this.user.currentUser">
            Rede Agrofloresta
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-list>
          <ion-item *ngIf="this.user.currentUser" (click)="profile(this.user.currentUser)" class="menu_profile">
            <ion-avatar item-start>
              <img img-cache [source]="this.api.imageUrl(this.user.currentUser.picture, 'thumbs')" >
            </ion-avatar>
            <h2>{{this.user.currentUser.name}}</h2>
            <p>{{this.user.currentUser._id}}</p>
          </ion-item>
          <button menuClose ion-item (click)="openPage('FeedPage')">Postagens</button>
          <button menuClose ion-item (click)="openPage('FeedPage', { category: 'event' })">Eventos</button>
          <button menuClose ion-item (click)="openPage('PlantsPage')">Tabela de plantas</button>
          <button menuClose ion-item (click)="openPage('DonatePage')">Seja um apoiador</button>
          <button menuClose ion-item (click)="openPage('AboutPage')">Sobre</button>
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
  
  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, private user: User, public api: Api, public menuCtrl: MenuController, public storage: Storage, private geolocation: Geolocation, imgCacheService: ImgCacheService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.imageLoaderConfig.enableDebugMode();
      // // this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      // this.imageLoaderConfig.setFallbackUrl('assets/img/logo.png');
      // this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      imgCacheService.initImgCache()
        .subscribe((v) => console.log('init'), (e) => console.log('fail init', e));


    });
    
    this.initTranslate();

    this.storage.get('currentPosition').then((p) => {
      if (!p || !p.latitude) {
        this.geolocation.getCurrentPosition().then((position) => {
          this.storage.set('currentPosition', { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, altitude: position.coords.altitude, timestamp: position.timestamp } ).catch((e) => {
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
    this.nav.setRoot('WelcomePage');   
    this.user.logout()
    // this.menuCtrl.close(); 
  }

  openPage(page, params?) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page, params);
  }

  profile(user) {
    this.nav.setRoot('ProfilePage', { id: user._id });
  }
}
