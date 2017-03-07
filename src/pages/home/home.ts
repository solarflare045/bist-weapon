import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Toon } from '../../models/toon.model';
import { GuildRepository } from '../../repositories/guild.repository';

@Component({
  templateUrl: './home.html',
})
export class HomeComponent {
  showAlts$: BehaviorSubject<boolean>;
  toons$: Observable<Toon[]>;

  constructor(private guild: GuildRepository) {
    this.showAlts$ = new BehaviorSubject(false);

    this.toons$ = this.showAlts$.switchMap((showAlts) => showAlts ? this.guild.toons$ : this.guild.mainToons$);
  }
}
