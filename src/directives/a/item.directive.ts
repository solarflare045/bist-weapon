import { Directive, Input, HostBinding, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';

import { CombineLatestAggregate } from '../../services/observable/observable';
import { Gear } from '../../models/gear.model';

@Directive({
  selector: 'a[appItemLink]',
})
export class ItemLinkDirective implements OnDestroy {
  private gear$: Subject<Gear> = new Subject();
  private subscription: Subscription;

  @HostBinding() rel;

  @Input() set appItemLink(gear: Gear) { this.gear$.next(gear); }

  constructor() {
    this.subscription = this.gear$
      .switchMap((gear) => Observable.combineLatest( gear.id$, gear.level$, gear.enchant$, gear.gems$ ))
      .map(([ id, level, enchant, gems ]) => {
        let rel = `item=${ id }&ilvl=${ level }`;
        if (enchant) { rel += `&ench=${ enchant }`; }
        if (gems.length) { rel += `&gems=${ gems.join(':') }`; }
        return rel;
      })
      .do((rel) => {
        this.rel = rel;
      })
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
