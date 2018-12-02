import { Component } from '@angular/core';

/**
 * Generated class for the TopicMessageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'topic-message',
  templateUrl: 'topic-message.html'
})
export class TopicMessageComponent {

  text: string;

  constructor() {
    console.log('Hello TopicMessageComponent Component');
    this.text = 'Hello World';
  }

}
