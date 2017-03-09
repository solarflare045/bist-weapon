import { SharedNode, SharedValue, SharedTimeOffsetNumber, SharedList, TIMESTAMP } from '../services/db/db';
import { Observable } from 'rxjs/Rx';
import { Gear } from './gear.model';
import * as moment from 'moment';

export class Toon extends SharedNode {
  private _class: SharedValue<number> = this.child('class').asValue();
  private _level: SharedValue<number> = this.child('level').asValue();
  private _name: SharedValue<string> = this.child('name').asValue();
  private _realm: SharedValue<string> = this.child('realm').asValue();
  private _thumbnail: SharedValue<string> = this.child('thumbnail').asValue();

  private _gearUpdating: SharedValue<boolean> = this.child('gearUpdating').asValue();
  private _gearUpdated: SharedTimeOffsetNumber = this.child('gearUpdated').asOffsetValue();

  private _position: SharedValue<string> = this.root().child('guild').child('toons').child(this.key).asValue();

  public readonly class$ = this._class.value$;
  public readonly level$ = this._level.value$;
  public readonly name$ = this._name.value$;
  public readonly realm$ = this._realm.value$;
  public readonly thumbnail$ = this._thumbnail.value$;

  public readonly gearUpdating$ = this._gearUpdating.value$;
  public readonly gearUpdated$ = this._gearUpdated.value$.map((ms) => ms && moment(ms));

  public readonly position$ = this._position.value$;

  markGearUpdating(val: boolean) { return this._gearUpdating.update(val); }
  markGearUpdated() { return this._gearUpdated.update(<number>TIMESTAMP); }

  setPosition(val: string) {
    return this._position.update(val);
  }
}
