import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Toon } from '../../models/toon.model';
import { GuildRepository } from '../../repositories/guild.repository';
import { UserRepository } from '../../repositories/user.repository';

@Component({
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnDestroy {
  sub: Subscription;
  toons$: Observable<Toon[]>;

  constructor(private guild: GuildRepository, private users: UserRepository, private router: Router) {
    this.toons$ = this.guild.myToons$;

    this.sub = this.users.me$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
