import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: Observable<any[]>;
  itemsCollection: AngularFirestoreCollection<any>;
  user: any;
  name: any;
  msgValue: string = '';

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth){
    this.itemsCollection = db.collection('items', ref => ref.orderBy('created','desc'));
    this.items = this.itemsCollection.valueChanges();
    

    this.afAuth.user.subscribe( user => {
      if (user) {
        console.log(user.displayName)
        this.user = user.displayName
      }
    })
  }
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  chatSend(msg) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    console.log(timestamp);
    this.itemsCollection.add({name: this.user, msg: msg, created:timestamp });
  }

}
