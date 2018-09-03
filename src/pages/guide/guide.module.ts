import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuidePage } from './guide';
import { QuillModule } from 'ngx-quill'
import { Database } from '../../providers';
import { Utils } from '../../utils/utils';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    GuidePage,
  ],
  imports: [
    IonicPageModule.forChild(GuidePage),
    QuillModule,
    PipesModule
  ], 
  providers: [
  	Database,
  	Utils
  ]
})
export class GuidePageModule {}
