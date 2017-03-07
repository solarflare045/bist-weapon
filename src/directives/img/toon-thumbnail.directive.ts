import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: 'img[appToonThumbnail]',
})
export class ToonThumbnailDirective {
  @HostBinding() src: string;
  @Input() set appToonThumbnail(thumb: string) {
    this.src = thumb ? `https://us.battle.net/static-render/us/${ thumb }` : '';
  }
}
