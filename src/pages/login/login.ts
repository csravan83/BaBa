import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public afAuth: AngularFireAuth) {
  }

  start(){
    this.afAuth.auth.signInAnonymously().then((info) => {
      
    }).catch((error)=> {
      console.log(error)
    })
  }

}
