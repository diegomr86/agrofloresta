import { Component, Input } from '@angular/core';

/**
 * Generated class for the SafeContentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'safe-content',
  template: `
    <div *dynamicComponent="template; context: {text: text};"></div>
  `
})
export class SafeContentComponent {
	@Input() template;

  constructor() {
    console.log('Hello SafeContentComponent Component');
  }

}
