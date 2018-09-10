import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostFormPage } from './post-form';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PostFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PostFormPage),
		ComponentsModule,
		TagInputModule, 
		FormsModule,
		ReactiveFormsModule
  ]
})
export class PostFormPageModule {}
