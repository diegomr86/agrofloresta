import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopicFormPage } from './topic-form';
import { QuillModule } from 'ngx-quill'
import { ComponentsModule } from '../../components/components.module';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [
    TopicFormPage,
  ],
  imports: [
    IonicPageModule.forChild(TopicFormPage),
    QuillModule,
    ComponentsModule,
    TagInputModule
  ],
})
export class TopicFormPageModule {}
