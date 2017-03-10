import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { Observable, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';

import { Api } from '../../../../services/api/api';
import { COLORS } from '../../../../directives/a/item.directive';

// http://www.wowhead.com/item=144438/zeks-exterminatus
// http://www.wowdb.com/items/144438-zeks-exterminatus

export interface ISelectedGear {
  id: number;
  name: string;
  quality: string;
}

@Component({
  templateUrl: './select-gear.html',
})
export class SelectGearModelComponent extends DialogComponent<void, ISelectedGear> {
  private _url = '';
  private _url$ = new Subject<string>();
  lookingUp: boolean;
  gear$: Observable<ISelectedGear>;
  gearSelect: ISelectedGear;
  rel$: Observable<string>;

  constructor(dialogService: DialogService, api: Api) {
    super(dialogService);

    this.lookingUp = false;
    this.gear$ = this._url$.startWith('')
      .map((url: string) => {
        const match = url.match(/item(?:s\/|=)(\d+)/);
        return match && match[1];
      })
      .switchMap((id) =>
        (!id)
          ? Observable.of(null)
          : Observable.timer(1000).do(() => this.lookingUp = true)
              .flatMapTo(
                api.get<ISelectedGear>([ 'wow', 'item', id ])
                  .do(() => this.lookingUp = false)
                  .catch(() => Observable.empty())
                  .map((o) => _.pick(o, [ 'id', 'name', 'quality' ])),
              ),
      )
      .publishReplay(1).refCount()
      .do((val) => this.gearSelect = val);

    this.rel$ = this.gear$.filter((o) => !!o)
      .map((gear) => `id=${ gear.id }`);
  }

  get url(): string { return this._url; }
  set url(url: string) {
    this._url = url;
    this._url$.next('');
    this._url$.next(url);
  }

  cancel(): void {
    this.result = null;
    this.close();
  }

  confirm(): void {
    this.result = this.gearSelect;
    this.close();
  }
}
