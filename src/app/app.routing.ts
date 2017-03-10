import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from '../components/nav/nav.component';

import { LoginComponent } from '../pages/login/login';
import { HomeComponent } from '../pages/home/home';
import { MyToonsComponent } from '../pages/mytoons/mytoons';
import { ToonComponent } from '../pages/toons/view/toon';
import { GearSetComponent } from '../pages/toons/view/gear-set/gear-set';
import { SelectGearModelComponent } from '../pages/toons/view/select-gear/select-gear';

import { ToonResolver } from '../pages/toons/view/toon.resolve';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: '', component: NavComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'mytoons', component: MyToonsComponent },
    { path: 'toons/:id', component: ToonComponent, resolve: { toon: ToonResolver } },
  ] },
];

export const CONST_ROUTING = RouterModule.forRoot(ROUTES);

export const COMPONENTS = [
  NavComponent,

  LoginComponent,
  HomeComponent,
  MyToonsComponent,
  ToonComponent,
  GearSetComponent,
  SelectGearModelComponent,
];

export const ENTRY_COMPONENTS = [
  SelectGearModelComponent,
];

export const RESOLVERS = [
  ToonResolver,
];
