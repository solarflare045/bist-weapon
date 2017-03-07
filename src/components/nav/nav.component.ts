import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Toon } from '../../models/toon.model';
import { GuildRepository } from '../../repositories/guild.repository';

@Component({
  templateUrl: './nav.component.html',
})
export class NavComponent {
  toons$: Observable<Toon[]>;

  constructor(private guild: GuildRepository) {
    this.toons$ = this.guild.myToons$;
  }
}
