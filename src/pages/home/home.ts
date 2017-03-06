import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: './home.html',
})
export class HomeComponent {
  uid$: Observable<string>;

  constructor(af: AngularFire, router: Router) {
    this.uid$ = Observable.from(af.auth)
      .switchMap((auth) => {
        if (!auth) {
          router.navigate([ 'login' ]);
          return Observable.empty();
        }

        return Observable.of(auth.uid);
      });
  }
}
