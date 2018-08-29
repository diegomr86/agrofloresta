import { NgModule } from '@angular/core';
import { UserComponent } from './user/user';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [UserComponent],
	imports: [IonicModule],
	exports: [UserComponent]
})
export class ComponentsModule {}
