import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage({
  segment: "topic/:id"
})
@Component({
  selector: 'page-topic',
  templateUrl: 'topic.html',
})
export class TopicPage {
  topic;

  constructor(public navCtrl: NavController, navParams: NavParams, public database: Database, public api: Api, public utils: Utils) {
    this.database.get(navParams.get('id')).then(res => {
      this.topic = res
      console.log('this.topic', this.topic);
    });
  }

  edit() {
    this.navCtrl.push('TopicFormPage', { id: this.topic._id });
  } 

  cachedImages(content: string) {
    content = content.replace(/<img src/g,'<img img-cache [source]');
    // content = content.replace(/<\/img>/g,'</img-loader>');
    // content = content.replace(/(<img-loader("[^"]*"|[^\/">])*)>/gi, "$1>")
    return content
  }

}
