import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnInit, OnDestroy, Renderer2
} from '@angular/core';

import { ImgCacheService } from '../../global';

import { Subscription } from 'rxjs/Subscription';

/**
* This directive is charge of cache the images and emit a loaded event
*/
@Directive({
  selector: '[img-cache]'
})
export class ImgCacheDirective implements OnInit, OnDestroy {

  @Input('source') // double check
  public source: string = '';
  @Input('noitem') // double check
  public noitem: string = '';

  @Output()
  public loaded: EventEmitter<void> = new EventEmitter<void>();

  public loadListener: () => void;
  public errorListener: () => void;

  private cacheSubscription: Subscription;

  constructor(public el: ElementRef,
    public imgCacheService: ImgCacheService,
    public renderer: Renderer2) { }

  public ngOnInit(): void {
    // get img element
    const nativeElement: HTMLElement = this.el.nativeElement;

    // add load listener
    this.loadListener = this.renderer.listen(nativeElement, 'load', () => {
      this.renderer.addClass(nativeElement, 'loaded');
      this.loaded.emit();
    });

    this.errorListener = this.renderer.listen(nativeElement, 'error', () => {
      // nativeElement.remove();
      // this.renderer.setAttribute(nativeElement, 'src', 'assets/img/logo.png');
    });

    if (!this.source) {
      this.source = this.noitem || "assets/img/logo.png"
    }

    this.renderer.setAttribute(nativeElement, 'src', this.source);

    // cache img and set the src to the img
    // if (this.platform.is('android')) {
    //   this.cacheSubscription =
    //     this.imgCacheService
    //         .cache(this.source)
    //         .subscribe((value) => {
    //           this.renderer.setAttribute(nativeElement, 'src', value);
    //         }, (e) => console.log(e));
    // }
  }

  public ngOnDestroy(): void {
    // remove listeners
    this.loadListener();
    this.errorListener();
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
  }

}
