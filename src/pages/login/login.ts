import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
  templateUrl: './login.html',
})
export class LoginComponent {
  error: string;
  token: string;
  authenticated$: Observable<boolean>;

  constructor(ar: ActivatedRoute, af: AngularFire, router: Router) {
    this.token = ar.snapshot.queryParams['token'];

    if (this.token) {
      af.auth.login(this.token, { provider: AuthProviders.Custom, method: AuthMethods.CustomToken })
        .catch((error) => this.error = error.message);
    }

    this.authenticated$ = Observable.from(af.auth)
      .map((auth) => !!auth)
      .do((auth) => {
        if (auth) {
          router.navigate([ 'home' ]);
        }
      });
  }
}
