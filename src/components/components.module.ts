import { NgModule } from '@angular/core';
import { UserComponent } from './user/user';
import { IonicModule } from 'ionic-angular';
import { DynamicComponentModule } from 'ng-dynamic';
import { QuillModule } from 'ngx-quill'
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';

import { SafeContentComponent } from './safe-content/safe-content';
import { PictureUploadComponent } from './picture-upload/picture-upload';
import { PostUserComponent } from './post-user/post-user';
import { TextEditorComponent } from './text-editor/text-editor';
import { CommentsComponent } from './comments/comments';
import { MoonComponent } from './moon/moon';
import { TopicMessageComponent } from './topic-message/topic-message';
import { AvatarComponent } from './avatar/avatar';

@NgModule({
  declarations: [
    UserComponent,
    SafeContentComponent,
    PictureUploadComponent,
    PostUserComponent,
    TextEditorComponent,
    CommentsComponent,
    MoonComponent,
    TopicMessageComponent,
    AvatarComponent
  ],
  imports: [IonicModule,
    DynamicComponentModule.forRoot({
      imports: []
    }),
    QuillModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [UserComponent,
    SafeContentComponent,
    PictureUploadComponent,
    PostUserComponent,
    TextEditorComponent,
    CommentsComponent,
    MoonComponent,
    TopicMessageComponent,
    AvatarComponent]
})
export class ComponentsModule { }
