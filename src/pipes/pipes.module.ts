import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe';
import { UrlPipe } from './url/url';
import { TruncatePipe } from './truncate/truncate';
import { TimeAgoPipe } from './time-ago/time-ago';
@NgModule({
	declarations: [SafePipe,
    UrlPipe,
    TruncatePipe,
    TimeAgoPipe],
	imports: [],
	exports: [SafePipe,
    UrlPipe,
    TruncatePipe,
    TimeAgoPipe]
})
export class PipesModule {}
