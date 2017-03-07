import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

import { Toon } from '../../../models/toon.model';

@Component({
  templateUrl: './toon.html',
})
export class ToonComponent implements OnDestroy {
  toon: Toon;
  subscription: Subscription;

  constructor(private route: ActivatedRoute) {
    this.subscription = this.route.data
      .do(({ toon }) => this.toon = toon)
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
