import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import {LoadingController} from 'ionic-angular'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  constructor(
              public loadingCtrl: LoadingController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public afAuth: AngularFireAuth) {
  }

  start(){
      let loader = this.loadingCtrl.create({
        content: "Loading",
        duration: 1500,
      });
      loader.present();
    this.afAuth.auth.signInAnonymously().then((info) => {
      loader.dismissAll();
    }).catch((error)=> {
      console.log(error)
    })
  }

}
