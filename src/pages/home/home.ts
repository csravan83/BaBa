import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Write } from '../write/write';
import { Post } from '../post/post';
import "rxjs/add/operator/map";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: FirebaseListObservable<any>;;

  constructor(public navCtrl: NavController,
              public modal: ModalController,
              public navPar: NavParams, 
              private db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {

      this.items = this.db.list('/messages', {
        query: {
          orderByChild: 'createAt',
          limitToLast: 50
        }
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
      
  }

  writePost(){
   let profileModal = this.modal.create(Write, {type: 'post'});
   profileModal.present();
  }
  openPost(item){
   let profileModal = this.modal.create(Post, {item});
   profileModal.present();
  }

}
