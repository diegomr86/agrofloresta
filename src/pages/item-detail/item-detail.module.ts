import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemDetailPage } from './item-detail';
import { Utils } from '../../utils/utils';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ItemDetailPage
  ],
  providers: [
    Utils
  ]

})
export class ItemDetailPageModule { }
