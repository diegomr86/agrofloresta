import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEditPage } from './profile-edit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProfileEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileEditPage),
    ComponentsModule
  ],
})
export class ProfileEditPageModule {}
