import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { Api } from '../../../services/api/api';
import { Db } from '../../../services/db/db';
import { Toon } from '../../../models/toon.model';

const SLOTS = [
  'head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist',
  'legs', 'feet', 'finger1', 'finger2', 'trinket1', 'trinket2', 'mainHand', 'offHand'
];

@Component({
  templateUrl: './toon.html',
})
export class ToonComponent implements OnDestroy {
  gearing = false;
  toon: Toon;
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private api: Api, private db: Db) {
    this.subscription = this.route.data
      .do(({ toon }) => this.toon = toon)
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getGear(toon: Toon): void {
    this.gearing = true;
    Observable.combineLatest( toon.name$, toon.realm$ )
      .first()
      .switchMap(([ name, realm ]) =>
        this.api.get<any>([ 'wow', 'character', realm, name ], { fields: 'items' })
          .map((response) =>
            _.chain(response.items)
              .pick(SLOTS)
              .mapValues((value, key) => _.extend({ toon: toon.key, slot: key }, value))
              .mapKeys((value, key) => `${ name }::have::${ key }`)
              .value(),
          )
      )
      .switchMap((gear) =>
        Observable.from( _.toPairs(gear) )
          .map(([ key, item ]: [ string, Object ]) => Observable.defer(() => this.db.root.child('gear').child(key).ref.set(item)))
          .mergeAll(),
      )
      .finally(() => this.gearing = false)
      .subscribe();
  }
}
