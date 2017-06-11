import { Component, Input, Output, EventEmitter} from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Write } from '../write/write';
import { Post } from '../post/post';
import "rxjs/add/operator/map";
import { Geolocation } from '@ionic-native/geolocation';

import { LatLonEllipsoidal } from "geodesy"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items=[];

  promotion: boolean = false;

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

  }

ionViewWillEnter() {
  this.loadData()
}

  loadData(){
    this.geolocation.getCurrentPosition().then((resp) => {
    this.location = { lat: resp.coords.latitude, lng: resp.coords.longitude }

    this.db.database.ref('/messages').limitToLast(50).on('value', asyncItems => {
      this.items = [];
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
      
         var len = this.items.length;
          for (var i = len-1; i>=0; i--){
            for(var j = 1; j<=i; j++){
              if(this.items[j-1].createAt<this.items[j].createAt){
                  var temp = this.items[j-1];
                  this.items[j-1] = this.items[j];
                  this.items[j] = temp;
                }
            }
          }
    })


    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.db.database.ref('/promotion').on('value', promo => {
      console.log(promo.val())
      this.promotion = promo.val();
    })


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

   if(this.myVote==1){
       return;
    }

      this.db.object('/messages/' + postID + '/voteCount').$ref
      .ref.transaction(voteCount => {
          if (voteCount === null) {
              return voteCount = 1;
          } else {
              return voteCount + 1;
          }
      })
    this.myVote++;
    this.voteCount++;
    this.emitEvent();

    }


  downVote(postID){
    if(this.myVote== -1){
      return;
    }
      this.db.object('/messages/' + postID + '/voteCount').$ref
      .ref.transaction(voteCount => {
          if (voteCount === null) {
              return voteCount = 0;
          } else {
              return voteCount - 1;
          }
      })
    this.myVote--;
    this.voteCount--;
    this.emitEvent();

  }
  emitEvent(){
    this.change.emit({myVote: this.myVote});
  }

}
