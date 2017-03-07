import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as _ from 'lodash';

import { Db, SharedValue } from '../db/db';

export interface IClass {
  id: number;
  name: string;
}

@Injectable()
export class Api {
  private key: SharedValue<string>;
  private classes$: Observable<IClass[]>;

  constructor(private db: Db, private http: Http) {
    this.key = this.db.root.child('api').child('key').asValue<string>();

    this.classes$ = this.get<{ classes: IClass[] }>('/wow/data/character/classes')
      .map((response) => response.classes)
      .publishLast()
      .refCount();
  }

  get<T>(path: string | string[]): Observable<T> {
    const urlSegment = _.isArray(path) ? ['', ...<string[]>path].join('/') : path;

    return this.key.value$
      .switchMap((key) => this.http.get(`https://us.api.battle.net${ urlSegment }?apikey=${ key }`))
      .map((response) => response.json())
      .first();
  }

  classes(): Observable<IClass[]> {
    return this.classes$;
  }

  classById(id$: Observable<number>): Observable<IClass> {
    return this.classes$.combineLatest(id$)
      .map(([ classes, id ]) => _.find(classes, (cls) => cls.id === id) || { id, name: 'Unknown' });
  }
}
