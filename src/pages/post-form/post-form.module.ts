import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostFormPage } from './post-form';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PostFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PostFormPage),
		ComponentsModule,
		TagInputModule, 
		FormsModule,
		ReactiveFormsModule,
    PipesModule
  ]
})
export class PostFormPageModule {}
