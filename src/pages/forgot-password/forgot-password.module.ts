import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ForgotPasswordPage } from './forgot-password';

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordPage),
    TranslateModule.forChild()
  ],
  exports: [
    ForgotPasswordPage
  ]
})
export class ForgotPasswordPageModule { }
