import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Report2Model } from '../models/report2';
import { ReportDateModel } from '../models/report-date';

@Injectable()
export class Report2Service {

  report2List: AngularFireList<any>;
  reportListDate: AngularFireList<any>;
  newReport: Report2Model = new Report2Model();
  newReportDate: ReportDateModel = new ReportDateModel();

  constructor(private firebase: AngularFireDatabase) { }

  getReports2() {
    this.report2List = this.firebase.list('report2');   
    return this.report2List;
  }

  getReportsDate($key){
    this.reportListDate = this.firebase.list('report2/'+$key+'/dates');
    return this.reportListDate;
  }

  getReportsDate0($key){
    this.reportListDate = this.firebase.list('report2/'+$key+'/dates/0');
    return this.reportListDate;
  }

  insertReport2(report: Report2Model) {
    this.report2List.push({
      dates: report.dates,
      lastName: report.lastName,
      mail: report.mail,
      name: report.name
    })
  }

  insertReportDate(reportDate: ReportDateModel){
    this.reportListDate.push({
      dates: reportDate.date,
      hourStart: reportDate.hourStart,
      hourEnd: reportDate.hourEnd,
      userAssist: reportDate.userAssist,
      boolMatch: reportDate.boolMatch,
      assistance: reportDate.assistance,
      boolAny: reportDate.boolAny,
      therapist: reportDate.therapist,
      mail: reportDate.mail,
    })
  }

  updateReport2(key:string, report: Report2Model){
    this.report2List.update(report.$key, {
      dates: report.dates,
      lastName: report.lastName,
      mail: report.mail,
      name: report.name
    });
  }

  deleteReportDate0($key){
    this.reportListDate = this.firebase.list('report2/'+$key+'/dates');
    this.reportListDate.remove('0');
  }

}
