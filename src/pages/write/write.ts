import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-write',
  templateUrl: 'write.html',
})
export class Write {

  type: string;
  postId: string;
  placeholder= "โพสข้อความ...... (BaBa จะไม่ระบุตัวตนของคุณ)";

  text: string;
  messages: FirebaseListObservable<any>;
  comments: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, 
              public afData: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              public view: ViewController,
              public navParams: NavParams) {
      this.type = this.navParams.get('type');
      if(this.type === 'comment'){
        this.placeholder = "Write a comment"
        this.postId = this.navParams.get('postId');
      }
      
  }

  post(){
    if(this.type === 'post'){
      this.messages = this.afData.list('/messages');
      this.messages.push({text: this.text, createAt: Date.now(), user: this.afAuth.auth.currentUser.uid, commentsCount: 0}).then(() => {
        this.navCtrl.pop();
      })
    } if(this.type === 'comment'){
      this.afData.object('/messages/' + this.postId + '/commentsCount').$ref
      .ref.transaction(commentsCount => {
          if (commentsCount === null) {
              return commentsCount = 1;
          } else {
              return commentsCount + 1;
          }
      })
      this.comments = this.afData.list('/messages/' + this.postId + '/comments' );
      this.comments.push({text: this.text, createAt: Date.now(), user: this.afAuth.auth.currentUser.uid}).then(() => {
        this.navCtrl.pop();
      })      
    }

  }
  close(){
      this.navCtrl.pop();
  }

}
