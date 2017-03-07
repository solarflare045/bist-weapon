import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Toon } from '../../models/toon.model';
import { GuildRepository } from '../../repositories/guild.repository';
import { CombineLatestFilter } from '../../services/observable/observable';

@Component({
  templateUrl: './home.html',
})
export class HomeComponent {
  showAlts$: BehaviorSubject<boolean>;
  toons$: Observable<Toon[]>;

  constructor(private guild: GuildRepository) {
    this.showAlts$ = new BehaviorSubject(false);

    this.toons$ = this.guild.toons$
      .combineLatest(this.showAlts$)
      .switchMap(([ toons, showAlts ]) =>
        CombineLatestFilter(toons, (toon) => toon.position$.map((position) => position === 'main' || showAlts)),
      );
  }
}
