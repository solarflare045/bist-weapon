import { SharedNode, SharedValue } from '../services/db/db';

export class Toon extends SharedNode {
  private _class: SharedValue<number> = this.child('class').asValue();
  private _level: SharedValue<number> = this.child('level').asValue();
  private _name: SharedValue<string> = this.child('name').asValue();
  private _thumbnail: SharedValue<string> = this.child('thumbnail').asValue();

  private _position: SharedValue<string> = this.root().child('guild').child('toons').child(this.key).asValue();

  public readonly class$ = this._class.value$;
  public readonly level$ = this._level.value$;
  public readonly name$ = this._name.value$;
  public readonly thumbnail$ = this._thumbnail.value$;

  public readonly position$ = this._position.value$;

  setPosition(val: string) {
    return this._position.update(val);
  }
}
