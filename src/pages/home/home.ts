import { Component, Input, Output, EventEmitter} from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Write } from '../write/write';
import { Post } from '../post/post';
import "rxjs/add/operator/map";
import { Geolocation } from '@ionic-native/geolocation';

import { LatLonEllipsoidal } from "geodesy"

// const distances = sectors.map((sector) => {
//   const p1 = new LatLonEllipsoidal(Number(sector[0].lat), Number(sector[0].lng))
//   const p2 = new LatLonEllipsoidal(Number(sector[1].lat), Number(sector[1].lng))
//   return p1.distanceTo(p2)
// })



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items=[];

  votes: FirebaseObjectObservable<any>;
  location: {};
  item: {};
  text: string;

  constructor(public navCtrl: NavController,
              public modal: ModalController,
              public navPar: NavParams,
              private geolocation: Geolocation,
              private db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {



      console.log(this.geolocation.getCurrentPosition())


  }

ngOnInit() {
  this.geolocation.getCurrentPosition().then((resp) => {
    this.location = { lat: resp.coords.latitude, lng: resp.coords.longitude }

    this.db.database.ref('/messages').limitToLast(50).on('value', asyncItems => {
      console.log(asyncItems.val())
      const myItems = asyncItems.val()
      for (let prop in myItems) {
        const myItem = myItems[prop]
        const itemLocation = myItem.location || { lat: 10, lng: 10 }

        const postLocation = new LatLonEllipsoidal(itemLocation.lat, itemLocation.lng)
        const userLocation = new LatLonEllipsoidal(resp.coords.latitude, resp.coords.longitude)
        const distanceInMeters = postLocation.distanceTo(userLocation)
        const distance = distanceInMeters / 1000
        this.items.push({ ...myItem, distance, postID: prop })
      }
    })


    }).catch((error) => {
      console.log('Error getting location', error);
    });
}

  writePost(){
   let profileModal = this.modal.create(Write, {type: 'post'});
   profileModal.present();
  }
  openPost(item){
   let profileModal = this.modal.create(Post, {item});
   profileModal.present();
  }

  @Input() voteCount=0;
  @Input() myVote = 0;

  @Output('vote') change = new EventEmitter();

  upVote(postID){

   /* if(this.myVote==1){
       return;
    }

    this.myVote++;
    this.voteCount++;
    this.emitEvent();
*/

      /*this.db.database.ref("/messages/" +postID).update({
        votes: {}
      })*/

    this.db.database.ref("/messages/"+postID+"/upVotes/").once("value", info => {
      const itemData = info.val()


      this.votes = this.db.object('/messages/' + postID + '/upVotes')


      this.votes.push({text: this.text, createAt: Date.now(), user: this.afAuth.auth.currentUser.uid}).then(() => {
        this.navCtrl.pop();

      })


    })


      //this.db.database.ref().



    }


  downVote(){
    if(this.myVote== -1){
      return;
    }
    this.myVote--;
    this.voteCount--;
    this.emitEvent();

  }
  emitEvent(){
    this.change.emit({myVote: this.myVote});
  }

<<<<<<< HEAD

=======
  doRefresh(refresher){
    console.log("PHILIPP IMPLEMENT THAT SHIT by Philipp")
    refresher.complete();
  }
>>>>>>> 31639a22ebbc586d4add2530f697464b023a31b6
}
