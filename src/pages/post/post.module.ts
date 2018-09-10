import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { PostPage } from './post';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PostPage,
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
    IonicImageLoader,
    ComponentsModule,
    PipesModule
  ],
})
export class PostPageModule {}
