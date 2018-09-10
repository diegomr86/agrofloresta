import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemFormPage } from './item-form';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ItemFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemFormPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ItemFormPage
  ]
})
export class ItemFormPageModule { }
