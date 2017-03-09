import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { MomentModule } from 'angular2-moment';

import { CONST_ROUTING, COMPONENTS, RESOLVERS } from './app.routing';

import { ItemLinkDirective } from '../directives/a/item.directive';
import { ToonThumbnailDirective } from '../directives/img/toon-thumbnail.directive';

import { ClassNamePipe } from '../pipes/class-name/class-name.pipe';

import { GearRepository } from '../repositories/gear.repository';
import { GuildRepository } from '../repositories/guild.repository';
import { ToonRepository } from '../repositories/toon.repository';
import { UserRepository } from '../repositories/user.repository';

import { Api } from '../services/api/api';
import { Db } from '../services/db/db';

import { AppComponent } from './app.component';

const firebaseConfig: FirebaseAppConfig = {
  apiKey: 'AIzaSyA4-trsOJM3BZForxRcGD-wkbQTNSM-PYQ',
  authDomain: 'bist-weapon.firebaseapp.com',
  databaseURL: 'https://bist-weapon.firebaseio.com',
  storageBucket: 'bist-weapon.appspot.com',
  messagingSenderId: '522011680886',
};

@NgModule({
  declarations: [
    AppComponent,
    ItemLinkDirective,
    ToonThumbnailDirective,
    ClassNamePipe,
    ...COMPONENTS,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CONST_ROUTING,
  ],
  providers: [
    GearRepository,
    GuildRepository,
    ToonRepository,
    UserRepository,
    Api,
    Db,
    ...RESOLVERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
