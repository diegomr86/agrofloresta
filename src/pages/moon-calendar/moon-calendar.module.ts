import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoonCalendarPage } from './moon-calendar';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MoonCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(MoonCalendarPage),
    ComponentsModule
  ],
})
export class MoonCalendarPageModule {}
