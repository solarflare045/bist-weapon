import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Toon } from '../models/toon.model';
import { CombineLatestFilter } from '../services/observable/observable';
import * as _ from 'lodash';

import { Db } from '../services/db/db';
import { ToonRepository } from './toon.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class GuildRepository {
  public readonly toons$: Observable<Toon[]>;
  public readonly mainToons$: Observable<Toon[]>;

  public readonly myToons$: Observable<Toon[]>;
  public readonly myMainToons$: Observable<Toon[]>;
  public readonly myAltToons$: Observable<Toon[]>;

  constructor(private users: UserRepository, private toons: ToonRepository, private db: Db) {
    this.toons$ = this.db.root.child('guild').child('toons').asLinkList(this.db.root.child('toons').ref, (ref) => new Toon(ref)).items$;
    this.mainToons$ = this.filterToonByPosition(this.toons$, 'main');

    const toonLinks$ = this.users.me$.switchMap((user) => user ? user.toons$ : Observable.of([]));
    this.myMainToons$ = this.filterToonByPosition(toonLinks$, 'main');
    this.myAltToons$ = this.filterToonByPosition(toonLinks$, 'alt');
    this.myToons$ = Observable.combineLatest(this.myMainToons$, this.myAltToons$, (m, a) => _.concat(m, a));
  }

  private filterToonByPosition(toons: Observable<Toon[]>, position: string): Observable<Toon[]> {
    return toons.switchMap((tns) => CombineLatestFilter(tns, (toon) => toon.position$.map((p) => p === position)));
  }
}
