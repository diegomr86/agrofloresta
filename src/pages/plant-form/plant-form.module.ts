import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { TagInputModule } from 'ngx-chips';

import { PlantFormPage } from './plant-form';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PlantFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantFormPage),
    TranslateModule.forChild(),
    ComponentsModule,
    TagInputModule
  ],
  exports: [
    PlantFormPage
  ]
})
export class PlantFormPageModule { }
