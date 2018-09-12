import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe';
import { UrlPipe } from './url/url';
import { TruncatePipe } from './truncate/truncate';
@NgModule({
	declarations: [SafePipe,
    UrlPipe,
    TruncatePipe],
	imports: [],
	exports: [SafePipe,
    UrlPipe,
    TruncatePipe]
})
export class PipesModule {}
