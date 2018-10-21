import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideFormPage } from './guide-form';
import { QuillModule } from 'ngx-quill'
import { ComponentsModule } from '../../components/components.module';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [
    GuideFormPage,
  ],
  imports: [
    IonicPageModule.forChild(GuideFormPage),
    QuillModule,
    ComponentsModule,
    TagInputModule
  ],
})
export class GuideFormPageModule {}
