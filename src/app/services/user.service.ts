import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserModel } from './../models/users';


@Injectable()
export class UserService {

  userList: AngularFireList<any>;
  newUser: UserModel = new UserModel();

  constructor(private firebase:AngularFireDatabase) { }

  getUser(){
    this.userList = this.firebase.list('users');
    return this.userList;
  }

  insertUser(user: UserModel){
    this.userList.push({
      mail: user.mail,
      reserved: user.reserved,
      countReserved: user.countReserved,
      countAgendas: user.countAgendas,
      messageEvent: user.messageEvent
    });
  }

  updateUser(key: string, user: UserModel){
    this.userList.update(user.$key,{
      mail: user.mail,
      reserved: user.reserved,
      countReserved: user.countReserved,
      countAgendas: user.countAgendas,
      messageEvent: user.messageEvent
    });
  }

  updateUserReset($key:string) {
    this.userList.update($key, {
      countAgendas: 0,
      countReserved: 0,
      messageEvent: '',
      reserved: false
    })
  }

}
