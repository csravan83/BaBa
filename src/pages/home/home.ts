import { Component, Input, Output, EventEmitter} from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Write } from '../write/write';
import { Post } from '../post/post';
import "rxjs/add/operator/map";
import { Geolocation } from '@ionic-native/geolocation';

// import { LatLonEllipsoidal } from "geodesy"

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

  location: {};
  item: {};

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

  @Input() voteCount=4;
  @Input() myVote = 0;

  @Output('vote') change = new EventEmitter();

  upVote(){
    if(this.myVote==1){
       return;
    }

    this.myVote++;
    this.voteCount++;
    this.emitEvent();

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

}
