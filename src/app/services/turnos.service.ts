import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { TurnModel } from './../models/turns';

@Injectable()
export class TurnosService {
  terapeuta1: AngularFireList<any>;
  terapeuta2: AngularFireList<any>;
  terapeuta3: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) { }

  getTurnosT1() {
    this.terapeuta1 = this.firebase.list('terapeuta1');
    return this.terapeuta1;
  }

  getTurnosT2() {
    this.terapeuta2 = this.firebase.list('terapeuta2');
    return this.terapeuta2;
  }

  getTurnosT3() {
    this.terapeuta3 = this.firebase.list('terapeuta3');
    return this.terapeuta3;
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

  inserTurn2(turn2: TurnModel){
    this.terapeuta2.push({
      available: turn2.available,
      confirm: turn2.confirm,
      hour24: turn2.hour24,
      hourEnd: turn2.hourEnd,
      hourStart: turn2.hourStart,
      therapistId: turn2.therapistId,
      count: turn2.count,
      userName: turn2.userName
    });
  }

  inserTurn3(turn3: TurnModel){
    this.terapeuta3.push({
      available: turn3.available,
      confirm: turn3.confirm,
      hour24: turn3.hour24,
      hourEnd: turn3.hourEnd,
      hourStart: turn3.hourStart,
      therapistId: turn3.therapistId,
      count: turn3.count,
      userName: turn3.userName
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
  
  updateTurn2(key:string, turn: TurnModel){
    this.terapeuta2.update(turn.$key, {
      available: turn.available,
      confirm: turn.confirm,
      userName: turn.userName,
      count:turn.count
    });
  }

  updateTurn3(key:string, turn: TurnModel){
    this.terapeuta3.update(turn.$key, {
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

  updatet2Turn1($key:string) {
    this.terapeuta2.update($key, {
      available: true,
      confirm: false,
      userName: '',
      count: 0
    })
  }

  updatet3Turn1($key:string) {
    this.terapeuta3.update($key, {
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

  changeStateAvailableT2($key:string, bool: boolean) {
    this.terapeuta2.update( $key, {
      available: bool
    })
  }

  changeStateAvailableT3($key:string, bool: boolean) {
    this.terapeuta3.update( $key, {
      available: bool
    })
  }

  deleteTurns(){
    this.terapeuta1.remove();
    this.terapeuta2.remove();
    this.terapeuta3.remove();
  }
}
