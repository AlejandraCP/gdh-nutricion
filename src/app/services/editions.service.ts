import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { EditionsModel  } from "../models/editions";


@Injectable()
export class EditionsService {
  editionsMsgList: AngularFireList<any>;
  newMsgEdition: EditionsModel = new EditionsModel();

  constructor(private firebaseDB: AngularFireDatabase) { }

  getMsgEditions(){
    this.editionsMsgList = this.firebaseDB.list('editions');
    return this.editionsMsgList;
  }
  updateMsgdition(key: string, msgEdition: EditionsModel){
    this.editionsMsgList.update(key,{
      msg: msgEdition.msg
    });
  }
  
}
