import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PlantFormPage } from './plant-form';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PlantFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantFormPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    PlantFormPage
  ]
})
export class PlantFormPageModule { }
