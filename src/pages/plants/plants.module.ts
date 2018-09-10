import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PlantsPage } from './plants';

@NgModule({
  declarations: [
    PlantsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantsPage),
    TranslateModule.forChild()
  ],
  exports: [
    PlantsPage
  ]
})
export class PlantsPageModule { }
