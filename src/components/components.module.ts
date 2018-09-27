import { NgModule } from '@angular/core';
import { UserComponent } from './user/user';
import { IonicModule } from 'ionic-angular';
import { OnMount, DynamicComponentModule } from 'ng-dynamic';
import { IonicImageLoader } from 'ionic-image-loader';
import { ImgCacheModule } from 'ng-imgcache';
import { QuillModule } from 'ngx-quill'
import { PipesModule } from '../pipes/pipes.module';


import { SafeContentComponent } from './safe-content/safe-content';
import { PictureUploadComponent } from './picture-upload/picture-upload';
import { PostUserComponent } from './post-user/post-user';
import { TextEditorComponent } from './text-editor/text-editor';
import { CommentsComponent } from './comments/comments';
import { CommentUserComponent } from './comment-user/comment-user';

@NgModule({
	declarations: [
		UserComponent,
    	SafeContentComponent,
    PictureUploadComponent,
    PostUserComponent,
    TextEditorComponent,
    CommentsComponent,
    CommentUserComponent
    ],
	imports: [IonicModule,
        ImgCacheModule,
		DynamicComponentModule.forRoot({
	      imports: [ImgCacheModule]
	    }),
        QuillModule,
        PipesModule
    ],
	exports: [UserComponent,
    SafeContentComponent,
    PictureUploadComponent,
    PostUserComponent,
    TextEditorComponent,
    CommentsComponent,
    CommentUserComponent]
})
export class ComponentsModule {}
