import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { DirectivesModule } from '../../directives/directives.module';

import { PlantsPage } from './plants';

@NgModule({
  declarations: [
    PlantsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantsPage),
    TranslateModule.forChild(),
    IonicImageLoader,
    DirectivesModule
  ],
  exports: [
    PlantsPage
  ]
})
export class PlantsPageModule { }
