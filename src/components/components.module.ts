import { NgModule } from '@angular/core';
import { UserComponent } from './user/user';
import { IonicModule } from 'ionic-angular';
import { SafeContentComponent } from './safe-content/safe-content';

import { OnMount, DynamicComponentModule } from 'ng-dynamic';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
	declarations: [
		UserComponent,
    	SafeContentComponent
    ],
	imports: [IonicModule,
		IonicImageLoader.forRoot(),
		DynamicComponentModule.forRoot({
	      imports: [IonicImageLoader]
	    })
    ],
	exports: [UserComponent,
    SafeContentComponent]
})
export class ComponentsModule {}
