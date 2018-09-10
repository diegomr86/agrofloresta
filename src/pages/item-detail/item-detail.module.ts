import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';

import { ItemDetailPage } from './item-detail';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild(),
    ComponentsModule,
    IonicImageLoader
  ],
  exports: [
    ItemDetailPage
  ]

})
export class ItemDetailPageModule { }
