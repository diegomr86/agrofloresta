import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';

import { PlantPage } from './plant';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [
    PlantPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantPage),
    TranslateModule.forChild(),
    ComponentsModule,
    IonicImageLoader
  ],
  exports: [
    PlantPage
  ]

})
export class PlantPageModule { }
