import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class SharingDataService {

  currentBool: AngularFireList<any>;
  currentTime: AngularFireList<any>;
  hourCoor: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) { }

  getCuurentBool() {
    this.currentBool = this.firebase.list('sharingData');
    return this.currentBool;
  }

  getCuurentTime() {
    this.currentTime = this.firebase.list('currentDate');
    return this.currentTime;
  }

  getHourCoor() {
    this.hourCoor = this.firebase.list('hourCoor');
    return this.hourCoor;
  }

  updateCurentBool($key:string, bool: boolean){
    this.currentBool.update($key, {
      boolVal: bool
    });
  }

  updateCurentTiem($key:string, time: string){
    this.currentTime.update($key, {
      time: time
    });
  }

  updateHourCoor($key:string, turn: string) {
    this.hourCoor.update($key, {
      turn: turn
    })
  }

}
