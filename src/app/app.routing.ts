import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../pages/login/login';
import { HomeComponent } from '../pages/home/home';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
];

export const CONST_ROUTING = RouterModule.forRoot(ROUTES);

export const COMPONENTS = [
  LoginComponent,
  HomeComponent,
];
