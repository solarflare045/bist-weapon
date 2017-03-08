import { SharedNode, SharedValue } from '../services/db/db';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

export class Gear extends SharedNode {
  private _enchant: SharedValue<number> = this.child('tooltipParams').child('enchant').asValue();
  private _id: SharedValue<string> = this.child('id').asValue();
  private _level: SharedValue<number> = this.child('itemLevel').asValue();
  private _name: SharedValue<string> = this.child('name').asValue();
  private _slot: SharedValue<string> = this.child('slot').asValue();

  private _gems: Observable<number[]> = Observable.combineLatest(
    this.child('tooltipParams').child('gem0').asValue<number>().value$,
    this.child('tooltipParams').child('gem1').asValue<number>().value$,
    this.child('tooltipParams').child('gem2').asValue<number>().value$,
  );

  public readonly enchant$ = this._enchant.value$;
  public readonly id$ = this._id.value$;
  public readonly level$ = this._level.value$;
  public readonly name$ = this._name.value$;
  public readonly slot$ = this._slot.value$;

  public readonly gems$ = this._gems.map((gems) => _.compact(gems));
}
