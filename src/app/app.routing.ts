import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from '../components/nav/nav.component';

import { LoginComponent } from '../pages/login/login';
import { HomeComponent } from '../pages/home/home';
import { MyToonsComponent } from '../pages/mytoons/mytoons';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: '', component: NavComponent, children: [
    { path: 'home', component: HomeComponent },

    { path: 'mytoons', component: MyToonsComponent },
  ] },
];

export const CONST_ROUTING = RouterModule.forRoot(ROUTES);

export const COMPONENTS = [
  NavComponent,

  LoginComponent,
  HomeComponent,
  MyToonsComponent,
];

export const RESOLVERS = [

];
