import { NgModule } from '@angular/core';
import { UserComponent } from './user/user';
import { IonicModule } from 'ionic-angular';
import { OnMount, DynamicComponentModule } from 'ng-dynamic';
import { IonicImageLoader } from 'ionic-image-loader';
import { TimeAgoPipe } from 'time-ago-pipe';
import { QuillModule } from 'ngx-quill'

import { SafeContentComponent } from './safe-content/safe-content';
import { PictureUploadComponent } from './picture-upload/picture-upload';
import { PostUserComponent } from './post-user/post-user';
import { TextEditorComponent } from './text-editor/text-editor';

@NgModule({
	declarations: [
		UserComponent,
    	SafeContentComponent,
    PictureUploadComponent,
    PostUserComponent,
    TimeAgoPipe,
    TextEditorComponent
    ],
	imports: [IonicModule,
		IonicImageLoader.forRoot(),
		DynamicComponentModule.forRoot({
	      imports: [IonicImageLoader]
	    }),
        QuillModule
    ],
	exports: [UserComponent,
    SafeContentComponent,
    PictureUploadComponent,
    PostUserComponent,
    TextEditorComponent]
})
export class ComponentsModule {}
