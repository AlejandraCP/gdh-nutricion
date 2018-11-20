import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { InscripcionModel } from '../models/inscriptions';
// import { FirebaseListObservable } from 'angularfire2';

@Injectable()
export class InscriptionService {
  inscriptionList: AngularFireList<any>;
  newInscription: InscripcionModel = new InscripcionModel();

  constructor(private firebase: AngularFireDatabase) { }

  getInscriptions() {
    this.inscriptionList = this.firebase.list('inscriptions');
    return this.inscriptionList;
  }

  insertInscription(inscription: InscripcionModel){
    this.inscriptionList.push({
      date: inscription.dateInscription,
      hourStart: inscription.hourStart,
      hourEnd: inscription.hourEnd,
      userName: inscription.userName,
      boolAny: inscription.boolAny,
      therapist: inscription.therapist,
      userAssist: inscription.userAssist,
      stringVal: inscription.stringVal,
      type: inscription.type,
      displayName: inscription.displayName,
      mail: inscription.mail
    })
  }

  deleteInscription($key: string){
    this.inscriptionList.remove($key);
  }

  updateBoolAny($key: string, flag: boolean) {
    this.inscriptionList.update($key, { boolAny: flag })
  }

  updateStringVal($key: string, flag: string) {
    this.inscriptionList.update($key, { stringVal: flag })
  }

  updateType($key: string, flag: string) {
    this.inscriptionList.update($key, { type: flag })
  }

}
