import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from './../services/auth-firebase.service';

// services
import { InscriptionService } from '../services/inscription.service';
import { Report2Service } from './../services/report2.service';
import { UserService } from './../services/user.service';
import { SharingDataService } from '../services/sharing-data.service';


// models 
// models
import { InscripcionModel } from '../models/inscriptions';
import { ReportDateModel } from './../models/report-date';
import { log } from 'util';
@Component({
  selector: 'app-view-coor',
  templateUrl: './view-coor.component.html',
  styleUrls: ['./view-coor.component.css']
})
export class ViewCoorComponent implements OnInit {

  public emailUser: string;
  public isLogin: boolean;
  public name: string;
  public correctUser: boolean;
  public show: boolean;
  public actualDate: string;
  public therapist1Choose: boolean;
  public test: any;
  public assistTrue = true;
  public assistFalse = false;
  public keyUser: string;
  inscriptionList: any[];
  therapist1List: any[];
  report2List: any[];
  reporListDate: any[];
  hourCoorList: any[];
  orderArr = [{ turn: '1:00' }, { turn: '1:20' }, { turn: '1:40' }, { turn: '2:00' }, { turn: '2:20' }, { turn: '2:40' }, { turn: '3:00' }, { turn: '3:20' }, { turn: '3:40' }, { turn: '4:00' }, { turn: '4:20' }, { turn: '4:40' }]
  reportList: any[];

  constructor(
    private authFirebaseService: AuthFirebaseService,
    private inscriptionService: InscriptionService,
    private report2Service: Report2Service,
    private userService: UserService,
    public sharingDataService: SharingDataService
  ) { }

  ngOnInit() {
   
    this.isLogin = false;
    this.authFirebaseService.getAuth().subscribe(auth => {
      if (auth) {
        this.emailUser = auth.email;
        this.isLogin = true;
        if (auth.email === 'aponcedeleon@inteligogroup.com' || auth.email === 'valvarez@inteligogroup.com' ||
           auth.email === 'coordinadora@inteligogroup.com'
        ) {
          this.show = true;
        } else if (auth.email == undefined || auth.email == null) {
          this.show = false;
        }
      }
    });
    
    // get hour coor
    this.sharingDataService.getHourCoor()
    .snapshotChanges()
    .subscribe( item => {
      this.hourCoorList = [];
      item.forEach( elem => {
        let x = elem.payload.toJSON();
        x['$key'] = elem.key;
        this.hourCoorList.push(x);
      })
    })
    
    // current date
    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; //January is 0
    const yyyy: any = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    this.actualDate = dd + '/' + mm + '/' + yyyy;

    // get inscriptions
    this.inscriptionService.getInscriptions()
      .snapshotChanges()
      .subscribe(item => {
        this.inscriptionList = [];
        this.therapist1List = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          if (x['date'] === this.actualDate) {
              for (const i in this.hourCoorList) {
                if (x['hourStart'] === this.hourCoorList[i].turn) {
                  x['order'] = parseInt(i);
                  this.therapist1List.push(x);
                }
              }
            this.inscriptionList.push(x);
            this.therapist1List.sort(this.sortOrder);
          }          
        });
      });


    //get reports2
    this.report2Service.getReports2()
    .snapshotChanges()
    .subscribe(item =>{
      this.report2List = [];
      item.forEach(elem => {
        let x = elem.payload.toJSON();
        x['$key'] = elem.key;
        this.report2List.push(x)         
      });
    });


    this.therapist1Choose = true;
  }

  logoutUser() {
    this.authFirebaseService.logout();
  }

  sortOrder(a,b) {
    return a.order - b.order;
  }

  addRegister(date,hourStart,hourEnd,assistance,userAssist, stringVal,userName,boolMatch,boolAny, therapist,$key, type, displayName, mail) {
   
    this.report2List.forEach( reportElem => {
      if (mail == reportElem.mail) {
        this.keyUser = reportElem.$key   
      }
    });

    this.report2Service.getReportsDate(this.keyUser)
    .snapshotChanges()
    .subscribe(item1 =>{
      this.reporListDate = [];
      item1.forEach(e => {
        let y = e.payload.toJSON();
        y['$key'] = e.key;
        this.reporListDate.push(y);
      });
    });

    let cutDisplayName = displayName.indexOf(',');
    let lastName = displayName.substring(0,cutDisplayName)
    
    boolMatch = false;
    userAssist = userAssist.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/ /g,"");
    stringVal = stringVal.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/ /g,"");
    if(userAssist === stringVal) {
      boolMatch = true;
    }

    let reportDate : ReportDateModel = {
      date: date,
      hourStart: hourStart,
      hourEnd: hourEnd,
      userAssist: stringVal,
      boolMatch: boolMatch,
      assistance: assistance,
      boolAny: boolAny,
      therapist: therapist,
      mail: mail,
    }

    this.insertReportDate(reportDate);
    
    for (let index = 0; index < this.report2List.length; index++) {      
      if (this.report2List[''+index].dates !== undefined) {
        if (this.report2List[''+index].dates['0'] == 'report1234') {
          this.report2Service.deleteReportDate0(this.report2List[''+index].$key);
        }
      }
    }
    

    // this.reportService.insertReport(report);
    boolAny = true;
    type = 'password';
    this.inscriptionService.updateStringVal($key,stringVal)
    this.inscriptionService.updateBoolAny($key,boolAny);
    this.inscriptionService.updateType($key, type);
    
  }

  insertReportDate(x){
    if (ReportDateModel) {
      this.report2Service.insertReportDate(x);
    }
  }
  oh(x) {
    
  }

}
