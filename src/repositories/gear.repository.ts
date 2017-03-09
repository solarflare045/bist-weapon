import { Injectable } from '@angular/core';

import { Gear } from '../models/gear.model';
import { Db } from '../services/db/db';

@Injectable()
export class GearRepository {
  constructor(private db: Db) { }

  get(toon: string, type: string, slot: string): Gear {
    return this.db.root.child('gear').child(`${ toon }::${ type }::${ slot }`).asClass(Gear);
  }
}
