import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';

import { CONST_ROUTING, COMPONENTS } from './app.routing';

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
    ...COMPONENTS,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CONST_ROUTING,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
