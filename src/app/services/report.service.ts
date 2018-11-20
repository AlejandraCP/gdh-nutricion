import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ReportsModel } from '../models/reports';
import { ReportDates} from '../models/report2Date'

@Injectable()
export class ReportService {
  reportList: AngularFireList<any>;
  reportList2: AngularFireList<any>;
  newReport: ReportsModel = new ReportsModel();
  newDate: ReportDates = new ReportDates();
  constructor(private firebase: AngularFireDatabase) { }

  getReports() {
    this.reportList = this.firebase.list('reports');
    return this.reportList;
  }

  getReports2() {
    this.reportList2 = this.firebase.list('report2');
    return this.reportList2;
  }

  insertReport(report: ReportsModel) {
    this.reportList.push({
      date: report.date,
      hourStart: report.hourStart,
      hourEnd: report.hourEnd,
      userName: report.userName,
      userAssist: report.userAssist,
      userAssistRight: report.userAssistRight,
      boolMatch: report.boolMatch,
      assistance: report.assistance,
      boolAny: report.boolAny,
      therapist: report.therapist,
      lastName: report.lastName,
      mail: report.mail
    })
  }

  insertDate(newDate: ReportDates) {
    this.reportList2.push ({
      date: newDate.date,
      hourStart: newDate.hourStart,
      hourEnd: newDate.hourEnd,
      assistance: newDate.assistance,
      boolAny: newDate.boolAny,
      boolMatch: newDate.boolMatch,
      therapist: newDate.therapist,
      userAssist: newDate.userAssist
    })
  }
}
