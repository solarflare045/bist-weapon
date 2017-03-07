import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Resolve } from '@angular/router';
import { User } from '../models/user.model';

import { Db } from '../services/db/db';

@Injectable()
export class UserRepository {
  me$: Observable<User>;

  constructor(private db: Db) {
    this.me$ = this.db.auth.map((auth) => auth ? this.get(auth.uid) : null);
  }

  get(id: string): User { return this.db.root.child('users').child(id).asClass(User); }
}
