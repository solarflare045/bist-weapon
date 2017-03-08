import { SharedNode, SharedValue, SharedList } from '../services/db/db';
import { Observable } from 'rxjs/Rx';
import { Gear } from './gear.model';

export class Toon extends SharedNode {
  private _class: SharedValue<number> = this.child('class').asValue();
  private _level: SharedValue<number> = this.child('level').asValue();
  private _name: SharedValue<string> = this.child('name').asValue();
  private _realm: SharedValue<string> = this.child('realm').asValue();
  private _thumbnail: SharedValue<string> = this.child('thumbnail').asValue();

  private _position: SharedValue<string> = this.root().child('guild').child('toons').child(this.key).asValue();

  public readonly class$ = this._class.value$;
  public readonly level$ = this._level.value$;
  public readonly name$ = this._name.value$;
  public readonly realm$ = this._realm.value$;
  public readonly thumbnail$ = this._thumbnail.value$;

  public readonly position$ = this._position.value$;

  public readonly gear$ = this.buildGearSet('have');

  setPosition(val: string) {
    return this._position.update(val);
  }

  private buildGearSet(mid: string): Observable<Gear[]> {
    const query = this.root().child('gear').ref.orderByKey()
      .startAt(`${ this.key }::${ mid }`)
      .endAt(`${ this.key }::${ mid }\uffff`);

    return new SharedList(query, (ref) => new Gear(ref)).items$;
  }
}
