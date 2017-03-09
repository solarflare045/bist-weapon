import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { SLOTS, SLOT_INFOS, SlotInfo } from '../../../constants/slots';
import { Api } from '../../../services/api/api';
import { Db } from '../../../services/db/db';
import { Gear } from '../../../models/gear.model';
import { Toon } from '../../../models/toon.model';
import { GearRepository } from '../../../repositories/gear.repository';

@Component({
  templateUrl: './toon.html',
})
export class ToonComponent {
  gearing = false;
  gears: (Gear & { slotName: string })[];
  toon: Toon;

  constructor(private route: ActivatedRoute, private api: Api, private db: Db, private _gear: GearRepository) {
    this.toon = route.snapshot.data['toon'];
    this.gears = _.map(SLOT_INFOS, (slot) => _.extend(this._gear.get(this.toon.key, 'have', slot.id), { slotName: slot.name }));
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
