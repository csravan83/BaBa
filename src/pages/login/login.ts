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

  presentLoading(){
    let loader = this.loadingCtrl.create({
      content: "Loading",
      duration: 5000
    });
    loader.present();
  }

  start(){
    this.afAuth.auth.signInAnonymously().then((info) => {

    }).catch((error)=> {
      console.log(error)
    })
  }

}
