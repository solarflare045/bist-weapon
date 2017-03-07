import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Toon } from '../../../models/toon.model';
import { ToonRepository } from '../../../repositories/toon.repository';

@Injectable()
export class ToonResolver implements Resolve<Toon> {
  constructor(private toons: ToonRepository) { }
  resolve(route: ActivatedRouteSnapshot): Toon {
    return this.toons.get(route.params['id']);
  }
}
