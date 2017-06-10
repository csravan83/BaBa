import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Write } from '../write/write';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class Post {

  item;
  comments: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, 
              public afData: AngularFireDatabase,
              public modal: ModalController,
              public afAuth: AngularFireAuth,
              private platform: Platform,
              public navParams: NavParams) {
        this.item = this.navParams.get('item')
        this.comments = this.afData.list('/messages/' + this.item.postID + '/comments');   
}

  comment(){
   let commentModal = this.modal.create(Write, {type: 'comment', postId: this.item.postID});
   commentModal.present();
  }
  close(){
      this.navCtrl.pop();
  }

}
