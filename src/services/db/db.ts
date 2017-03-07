import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Rx';
import * as firebase from 'firebase';
import * as _ from 'lodash';

export type Query = firebase.database.Query;
export type Reference = firebase.database.Reference;
export type Snapshot = firebase.database.DataSnapshot;

@Injectable()
export class Db {
  constructor(private af: AngularFire) {

  }

  get auth() { return this.af.auth; }
  get root(): SharedNode { return new SharedNode( this.af.database.object('/').$ref ); }
}

export class SharedNode {
  protected _subject$: Observable<any>;
  public readonly key: string;
  public readonly value$: Observable<any>;

  constructor(public readonly ref: Reference) {
    this._subject$ = Observable.fromEventPattern(
      (handler: any) => this.ref.on('value', handler),
      (handler: any) => this.ref.off('value', handler),
    )
      .map((snapshot: Snapshot) => snapshot.val());

    this.key = this.ref.key;
    this.value$ = this._subject$;
  };

  remove() { return this.ref.remove(); }
  child(path: string) { return new SharedNode(this.ref.child(path)); }
  parent() { return new SharedNode(this.ref.parent); }
  root() { return new SharedNode(this.ref.root); }

  asClass<T extends SharedNode>(type: new (ref: Reference) => T): T { return new type(this.ref); }
  asList<T>(factory: (ref: Reference) => T) { return new SharedList<T>(this.ref, factory); }
  asValue<T>() { return new SharedValue<T>(this.ref); }

  asLinkList<T>(fullRef: Reference, factory: (ref: Reference) => T) { return new SharedLinkList<T>(this.ref, fullRef, factory); }
}

export class SharedValue<T> extends SharedNode {
  public readonly value$: Observable<T> = this._subject$;

  transaction(updater: (val: T) => T) { return this.ref.transaction(updater); }
  update(val: T) { return this.ref.set(val); }
}

interface CacheRef<T> {
  key: string;
  obj: T;
}

export class SharedList<T> {
  protected _subject$: Observable<T[]>;
  public readonly items$: Observable<T[]>;

  constructor(protected query: Query, protected factory: (ref: Reference) => T) {
    this._subject$ = Observable.merge(
      Observable.defer(() => this.query.once('value'))
        .filter((snapshot: Snapshot) => snapshot.numChildren() === 0)
        .map((snapshot: Snapshot) => ({ action: 'empty' })),

      Observable.fromEventPattern(
        (handler: any) => this.query.on('child_added', handler),
        (handler: any) => this.query.off('child_added', handler),
      ).map((snapshot: Snapshot) => ({ action: 'added', snapshot })),

      Observable.fromEventPattern(
        (handler: any) => this.query.on('child_removed', handler),
        (handler: any) => this.query.off('child_removed', handler),
      ).map((snapshot: Snapshot) => ({ action: 'removed', snapshot })),
    )
      .scan<{ action: string, snapshot?: Snapshot }, CacheRef<T>[]>((acc, { action, snapshot }) => {
        if ( action === 'empty' ) { return []; }

        const key = snapshot.key;
        if ( action === 'added' ) { return _.concat(acc, [{ key, obj: this.factory(snapshot.ref) }]); }
        if ( action === 'removed' ) { return _.reject(acc, (val) => val.key === key); }
      }, [])
      .debounceTime(0)
      .map((cache) => _.map(cache, (o) => o.obj));

    this.items$ = this._subject$;
  }

  push(val: any): T {
    return this.factory( this.query.ref.child( this.query.ref.push(val).key ));
  }
}

export class SharedLinkList<T> extends SharedList<T> {
  constructor(protected linkList: Reference, protected fullList: Reference, factory: (ref: Reference) => T) {
    super(linkList, (ref) => factory(fullList.child(ref.key)));
  }

  link(key: string): void {
    this.linkList.child(key).set(true);
  }

  unlink(key: string): void {
    this.linkList.child(key).remove();
  }

  push(val: any): T {
    const key = this.fullList.push(val).key;
    const spawn = this.factory( this.fullList.child( key ));
    this.link(key);
    return spawn;
  }
}
