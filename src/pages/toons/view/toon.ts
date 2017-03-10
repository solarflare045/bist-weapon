import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SLOTS, SLOT_INFOS, SlotInfo } from '../../../constants/slots';
import { Api } from '../../../services/api/api';
import { Db } from '../../../services/db/db';
import { Gear } from '../../../models/gear.model';
import { Toon } from '../../../models/toon.model';
import { GearRepository } from '../../../repositories/gear.repository';
import { IGearWithSlotName } from './gear-set/gear-set';
import { ISelectedGear, SelectGearModelComponent } from './select-gear/select-gear';

@Component({
  templateUrl: './toon.html',
})
export class ToonComponent implements OnDestroy {
  bis: IGearWithSlotName[];
  gears: IGearWithSlotName[];
  subscription: Subscription;
  toon: Toon;

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private db: Db,
    private _gear: GearRepository,
    private _modal: DialogService,
  ) {

    this.subscription = route.data
      .do(({ toon }) => {
        this.toon = toon;
        this.bis = this.fetchGear(this.toon.key, 'want');
        this.gears = this.fetchGear(this.toon.key, 'have');

        this.toon.gearUpdated$
          .subscribe((updated) => {
            const recent = moment().subtract(10, 'minutes');
            if (!moment.isMoment(updated) || updated.isBefore(recent)) {
              this.getGear(this.toon);
            }
          });
      })
      .subscribe();
  }

  private fetchGear(toon: string, type: string) {
    return _.map(SLOT_INFOS, (slot) => _.extend(this._gear.get(toon, type, slot.id), { slotName: slot.name, slotID: slot.id }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getGear(toon: Toon): void {
    toon.markGearUpdating(true);
    Observable.combineLatest( toon.name$, toon.realm$ )
      .first()
      .switchMap(([ name, realm ]) =>
        this.api.get<any>([ 'wow', 'character', realm, name ], { fields: 'items' })
          .map((response) =>
            _.chain(response.items)
              .pick(SLOTS)
              .mapValues((value, key) => _.extend({ toon: toon.key, slot: key, type: 'have' }, value))
              .mapKeys((value, key) => `${ name }::have::${ key }`)
              .value(),
          )
      )
      .switchMap((gear) =>
        Observable.from( _.toPairs(gear) )
          .map(([ key, item ]: [ string, Object ]) => Observable.defer(() => this.db.root.child('gear').child(key).ref.set(item)))
          .mergeAll(),
      )
      .do({ complete: () => toon.markGearUpdated() })
      .finally(() => toon.markGearUpdating(false))
      .subscribe();
  }

  updateGear(toon: Toon, ev: { slot: string, gear: Gear }): void {
    this._modal.addDialog(SelectGearModelComponent)
      .filter((newGear) => !!newGear)
      .subscribe((newGear) => {
        ev.gear.ref.set(
          _.extend(
            newGear,
            { slot: ev.slot, toon: toon.key, type: 'want' },
          ),
        );
      });
  }
}
