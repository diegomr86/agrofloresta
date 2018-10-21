import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuidesPage } from './guides';

@NgModule({
  declarations: [
    GuidesPage,
  ],
  imports: [
    IonicPageModule.forChild(GuidesPage),
  ],
})
export class GuidesPageModule {}
