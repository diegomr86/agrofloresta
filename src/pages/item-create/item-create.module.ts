import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemCreatePage } from './item-create';
import { Utils } from '../../utils/utils';

@NgModule({
  declarations: [
    ItemCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ItemCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    ItemCreatePage
  ],
  providers: [
    Utils
  ]
})
export class ItemCreatePageModule { }
