import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuidePage } from './guide';
import { QuillModule } from 'ngx-quill'
import { Database } from '../../providers';
import { Utils } from '../../utils/utils';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    GuidePage,
  ],
  imports: [
    IonicPageModule.forChild(GuidePage),
    QuillModule,
    PipesModule,
    ComponentsModule

  ], 
  providers: [
  	Database,
  	Utils
  ]
})
export class GuidePageModule {}
