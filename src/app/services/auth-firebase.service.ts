import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import 'rxjs-compat/add/operator/map';


@Injectable()
export class AuthFirebaseService {

  nameUserList: AngularFireList<any>;

  constructor(
    public afAuth: AngularFireAuth,
    public firebase: AngularFireDatabase
  ) { }

  getNameUser() {
    return this.nameUserList = this.firebase.list('user');
  }

  insertName(name: string) {
    this.nameUserList.push({
      name: name
    });
  }

  // function register
  registerUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then( user => resolve(user),
      err => reject(err));
    });
  }

  // function login
  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then( user => resolve(user),
      err => reject(err));
    });
  }

  // data user
  getAuth() {
    return this.afAuth.authState.map(auth => auth);
  }
  
  // function logout
  logout() {
    return this.afAuth.auth.signOut();
  }
  

}
