import { SharedNode, SharedLinkList } from '../services/db/db';
import { Toon } from './toon.model';

export class User extends SharedNode {
  private _toons: SharedLinkList<Toon> = this.child('toons').asLinkList( this.ref.root.child('/toons'), (ref) => new Toon(ref) );

  public readonly toons$ = this._toons.items$;
}
