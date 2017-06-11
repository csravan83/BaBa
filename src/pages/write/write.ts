import { Component, ViewChild, Input } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-write',
  templateUrl: 'write.html',
})
export class Write {

  type: string;
  postId: string;
  placeholder= "Share things with people around 10km - 100% anonymous ";

  text: string;
  messages: FirebaseListObservable<any>;
  comments: FirebaseListObservable<any>;
  location: {};

  constructor(public navCtrl: NavController,
              public afData: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              public view: ViewController,
              private geolocation: Geolocation,
              public navParams: NavParams) {
      this.type = this.navParams.get('type');
      if(this.type === 'comment'){
        this.placeholder = "Write a comment";
        this.postId = this.navParams.get('postId');        
      }

      this.geolocation.getCurrentPosition().then((resp) => {
        this.location = { lat: resp.coords.latitude, lng: resp.coords.longitude }
        }).catch((error) => {
          console.log('Error getting location', error);
        });


  }

  post(){
    if(this.type === 'post'){
      this.messages = this.afData.list('/messages');
      this.messages.push({
        text: this.text,
        createAt: Date.now(),
        user: this.afAuth.auth.currentUser.uid,
        commentsCount: 0,
        voteCount: 0,
        location: this.location
      }).then(() => {
        this.navCtrl.pop();
      })
    } 
    
    
    if(this.type === 'comment'){
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
