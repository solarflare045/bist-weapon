import { Injectable } from '@angular/core';
import { Toon } from '../models/toon.model';

import { Db } from '../services/db/db';

@Injectable()
export class ToonRepository {
  constructor(private db: Db) { }

  get(id: string): Toon { return this.db.root.child('toons').child(id).asClass(Toon); }
}

