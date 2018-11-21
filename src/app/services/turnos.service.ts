import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { TurnModel } from './../models/turns';

@Injectable()
export class TurnosService {
  terapeuta1: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) { }

  getTurnosT1() {
    this.terapeuta1 = this.firebase.list('terapeuta1');
    return this.terapeuta1;
  }

  inserTurn1(turn1: TurnModel){
    this.terapeuta1.push({
      available: turn1.available,
      confirm: turn1.confirm,
      hourEnd: turn1.hourEnd,
      hour24: turn1.hour24,
      hourStart: turn1.hourStart,
      therapistId: turn1.therapistId,
      count: turn1.count,
      userName: turn1.userName
    });
  }

  updateTurn1(key:string, turn: TurnModel){
      this.terapeuta1.update(turn.$key, {
        available: turn.available,
        confirm: turn.confirm,
        userName: turn.userName,
        count:turn.count
      });
  }

  updatet1Turn1($key:string) {
    this.terapeuta1.update($key, {
      available: true,
      confirm: false,
      userName: '',
      count: 0
    })
  }

  changeStateAvailableT1($key:string, bool: boolean) {
    this.terapeuta1.update( $key, {
      available: bool
    })
  }

  deleteTurns(){
    this.terapeuta1.remove();
  }
}
