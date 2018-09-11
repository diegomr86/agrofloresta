import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe';
import { UrlPipe } from './url/url';
@NgModule({
	declarations: [SafePipe,
    UrlPipe],
	imports: [],
	exports: [SafePipe,
    UrlPipe]
})
export class PipesModule {}
