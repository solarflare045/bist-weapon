import { Directive, Input, HostBinding, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';

import { CombineLatestAggregate } from '../../services/observable/observable';
import { Gear } from '../../models/gear.model';

const COLORS = ['#9d9d9d', '#9d9d9d', '#1eff00', '#0070dd', '#a335ee', '#ff8000', '#e6cc80', '#e6cc80'];

@Directive({
  selector: 'a[appItemLink]',
})
export class ItemLinkDirective implements OnDestroy {
  private gear$: Subject<Gear> = new Subject();
  private subscription: Subscription;

  @HostBinding('style.color') color: string;
  @HostBinding() rel: string;

  @Input() set appItemLink(gear: Gear) { this.gear$.next(gear); }
  @Input() set i(i: number) { this.color = COLORS[i]; }

  constructor() {
    this.subscription = this.gear$
      .switchMap((gear) =>
        Observable.combineLatest( gear.id$, gear.level$, gear.enchant$, gear.gems$, gear.bonuses$, gear.upgrade$, gear.quality$ ),
      )
      .map(([ id, level, enchant, gems, bonuses, upgrade, quality ]) => {
        this.color = COLORS[quality];

        let rel = `item=${ id }&ilvl=${ level }`;
        if (enchant)        { rel += `&ench=${ enchant }`           ; }
        if (gems.length)    { rel += `&gems=${ gems.join(':') }`    ; }
        if (bonuses.length) { rel += `&bonus=${ bonuses.join(':') }`; }
        if (upgrade)        { rel += `&upgd=${ upgrade }`           ; }
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
