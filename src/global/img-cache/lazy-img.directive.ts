import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnInit, OnDestroy, Renderer2
} from '@angular/core';

import { ImgCacheService } from './img-cache.service';

import { Subscription } from 'rxjs/Subscription';

/**
* This directive is charge of cache the images and emit a loaded event
*/
@Directive({
  selector: '[op-lazy-img-cache]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {

  @Input('source') // double check
  public source: string = '';

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
    console.log('ELEMENT: ', nativeElement);
    console.log('SRC: ', this.source);

    // add load listener
    this.loadListener = this.renderer.listen(nativeElement, 'load', () => {
      this.renderer.addClass(nativeElement, 'loaded');
      this.loaded.emit();
    });

    this.errorListener = this.renderer.listen(nativeElement, 'error', () => {
      nativeElement.remove();
    });

    this.renderer.setAttribute(nativeElement, 'src', this.source);
    // cache img and set the src to the img
    this.cacheSubscription =
      this.imgCacheService
          .cache(this.source)
          .subscribe((value) => {
            this.renderer.setAttribute(nativeElement, 'src', value);
          }, (e) => console.log(e));
  }

  public ngOnDestroy(): void {
    // remove listeners
    this.loadListener();
    this.errorListener();
    this.cacheSubscription.unsubscribe();
  }

}
