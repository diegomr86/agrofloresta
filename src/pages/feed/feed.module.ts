import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import 'rxjs/add/observable/fromEvent';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    FeedPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedPage),
    ComponentsModule,
    PipesModule,
    IonicImageLoader
  ],
})
export class FeedPageModule {}
