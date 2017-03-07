import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserRepository } from '../../repositories/user.repository';
import { Toon } from '../../models/toon.model';

@Component({
  templateUrl: './mytoons.html',
})
export class MyToonsComponent {
  toons$: Observable<Toon[]>;

  constructor(private users: UserRepository) {
    this.toons$ = this.users.me$.filter((user) => !!user).switchMap((user) => user.toons$);
  }
}
