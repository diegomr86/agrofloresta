import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PlantPage } from './plant';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PlantPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantPage),
    TranslateModule.forChild(),
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ],
  exports: [
    PlantPage
  ]

})
export class PlantPageModule { }
