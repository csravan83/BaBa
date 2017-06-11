import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';

import { Login } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import * as firebase from "firebase";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public afAuth: AngularFireAuth) {
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.rootPage = Login
      } else {
        this.rootPage = Login
      }
    })
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
