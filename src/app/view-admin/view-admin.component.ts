import { Component, OnInit } from "@angular/core";
import { AuthFirebaseService } from "./../services/auth-firebase.service";
import { ReportService } from "../services/report.service";
import { UserService } from "./../services/user.service";
import { Report2Service } from "./../services/report2.service";
import { TurnosService } from "./../services/turnos.service";
import { SharingDataService } from "./../services/sharing-data.service";

//models
import { TurnModel } from "./../models/turns";

@Component({
  selector: "app-view-admin",
  templateUrl: "./view-admin.component.html",
  styleUrls: ["./view-admin.component.css"]
})
export class ViewAdminComponent implements OnInit {
  public emailUser: string;
  public isLogin: boolean;
  public name: string;
  public correctUser: boolean;
  public show: boolean;
  public months: any[];
  public years: any[];
  public days: any[];
  public selectedValue: any;
  public selectedValueYear: any;
  public currentMonth: any;
  public currentYear: any;
  public dayOfMonthArr: any[];
  report2List: any[];
  reporListDate: any[];
  reportList: any[];
  datesArray: any[];
  cloneReport: any[];
  reportList2: any[];
  arrayArray: any[];
  monthArray: any[];
  terapeuta1: any[];
  terapeuta2: any[];
  terapeuta3: any[];
  userList: any[];
  countArray: any[];
  currentBool: any[];
  hourCoorList: any[];
  public changeBool: boolean;
  public showErrInput: boolean = false;
  id1: any = 0;

  // vars table
  public total: number;
  public noAttendance: number;
  public attendance: number;
  public writeCorrect: number;
  public writeIncorrect: number;
  public loading: boolean;
  public totalPercent: number;
  public noAttendancePercent: number;
  public attendancePercent: number;
  public writeCorrectPercent: number;
  public writeIncorrectPercent: number;
  public totalPercentAttendance: number;
  public attendanceBool: boolean;
  public noAttendanceBool: boolean;
  public totalPercentBool: boolean;
  public writeCorrectBool: boolean;
  public writeIncorrectBool: boolean;
  public totalAttendanceBool: boolean;

  constructor(
    private authFirebaseService: AuthFirebaseService,
    private reportService: ReportService,
    private report2Service: Report2Service,
    private turnosService: TurnosService,
    private sharingDataService: SharingDataService
  ) {}

  ngOnInit() {
    this.isLogin = false;
    this.authFirebaseService.getAuth().subscribe(auth => {
      if (auth) {
        this.emailUser = auth.email;
        this.isLogin = true;
        if (
          auth.email === "aponcedeleon@inteligogroup.com" ||
          auth.email === "valvarez@inteligogroup.com"
        ) {
          this.show = true;
        } else if (auth.email == undefined || auth.email == null) {
          this.show = false;
        }
      }
    });

    // get hour coor
    this.sharingDataService
      .getHourCoor()
      .snapshotChanges()
      .subscribe(item => {
        this.hourCoorList = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.hourCoorList.push(x);
        });
      });

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Setiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];

    this.days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    this.currentMonth = new Date().getMonth() + 1;
    if (this.currentMonth < 10) {
      this.currentMonth = "0" + this.currentMonth;
    } 
    
    this.currentYear = new Date().getFullYear();
    this.currentYear = this.currentYear.toString();

    this.months = [
      { id: 1, month: monthNames[0], number: "01" },
      { id: 2, month: monthNames[1], number: "02" },
      { id: 3, month: monthNames[2], number: "03" },
      { id: 4, month: monthNames[3], number: "04" },
      { id: 5, month: monthNames[4], number: "05" },
      { id: 6, month: monthNames[5], number: "06" },
      { id: 7, month: monthNames[6], number: "07" },
      { id: 8, month: monthNames[7], number: "08" },
      { id: 9, month: monthNames[8], number: "09" },
      { id: 10, month: monthNames[9], number: "10" },
      { id: 11, month: monthNames[10], number: "11" },
      { id: 12, month: monthNames[11], number: "12" }
    ];

    this.years = [
      { id: 15, year: "2018" },
      { id: 16, year: "2019" },
      { id: 17, year: "2020" },
      { id: 18, year: "2021" }
    ];

    for (let index = 0; index < this.months.length; index++) {
      this.currentMonth = "" + this.currentMonth;
      if (this.currentMonth === this.months[index].number) {
        this.selectedValue = this.months[index];
      }

      for (let y = 0; y < this.years.length; y++) {
        if (this.currentYear === this.years[y].year) {
          this.selectedValueYear = this.years[y];
        }
      }
    }

    // this.selectedValue = this.months[0];
    var currentDate = "/" + this.currentMonth + "/" + this.currentYear;

    this.years.forEach(element => {
      if (element.year === this.currentYear) {
      }
    });

    //get reports2
    //get reports2
    this.report2Service
      .getReports2()
      .snapshotChanges()
      .subscribe(item => {
        this.report2List = [];
        this.arrayArray = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.report2Service
            .getReportsDate(elem.key)
            .snapshotChanges()
            .subscribe(item1 => {
              this.reporListDate = [];
              item1.forEach(e => {
                let y = e.payload.toJSON();
                y["$key"] = e.key;
                this.reporListDate.push(y);
              });

              this.reporListDate.forEach(element => {
                if (
                  element["dates"].substring(3) ===
                  `${
                    this.selectedValue.number
                  }/${this.selectedValueYear.year.toString()}`
                ) {
                  this.arrayArray.push(element);
                  if (!this.report2List.includes(x)) {
                    Object.keys(x["dates"]).length;
                    this.report2List.push(x);
                  }
                }
                this.monthArray = [];
                this.writeIncorrect = 0;
                this.writeCorrect = 0;
                this.attendance = 0;
                this.noAttendance = 0;
                this.total = 0;
                this.writeCorrectPercent = 0;
                this.writeIncorrectPercent = 0;
                this.attendancePercent = 0;
                this.noAttendancePercent = 0;
                this.totalPercent = 0;
                this.totalPercentAttendance = 0;
                for (let index = 0; index < this.arrayArray.length; index++) {
                  if (this.arrayArray[index].assistance === false) {
                    this.noAttendance = this.noAttendance + 1;
                  } else if (this.arrayArray[index].boolMatch === true) {
                    this.writeCorrect = this.writeCorrect + 1;
                  } else if (
                    this.arrayArray[index].assistance === true &&
                    this.arrayArray[index].boolMatch === false
                  ) {
                    this.writeIncorrect = this.writeIncorrect + 1;
                  }
                  if (this.arrayArray[index].assistance === true) {
                    this.attendance = this.attendance + 1;
                  }
                }
                this.total = this.noAttendance + this.attendance;
                this.attendancePercent = Math.round(
                  (this.attendance * 100) / this.total
                );
                this.noAttendancePercent = Math.round(
                  (this.noAttendance * 100) / this.total
                );
                this.writeCorrectPercent = Math.round(
                  (this.writeCorrect * 100) / this.attendance
                );
                this.writeIncorrectPercent = Math.round(
                  (this.writeIncorrect * 100) / this.attendance
                );
                this.totalPercent =
                  this.attendancePercent + this.noAttendancePercent;
                this.totalPercentAttendance =
                  this.writeCorrectPercent + this.writeIncorrectPercent;

                if (isNaN(this.attendancePercent) === false) {
                  this.attendanceBool = true;
                } else if (isNaN(this.attendancePercent)) {
                  this.attendanceBool = false;
                }

                if (isNaN(this.noAttendancePercent) === false) {
                  this.noAttendanceBool = true;
                } else if (isNaN(this.noAttendancePercent)) {
                  this.noAttendanceBool = false;
                }

                if (isNaN(this.totalPercent) === false) {
                  this.totalPercentBool = true;
                } else if (isNaN(this.totalPercent)) {
                  this.totalPercentBool = false;
                }

                if (isNaN(this.writeCorrectPercent) === false) {
                  this.writeCorrectBool = true;
                } else if (isNaN(this.writeCorrectPercent)) {
                  this.writeCorrectBool = false;
                }

                if (isNaN(this.writeIncorrectPercent) === false) {
                  this.writeIncorrectBool = true;
                } else if (isNaN(this.writeIncorrectPercent)) {
                  this.writeIncorrectBool = false;
                }

                if (isNaN(this.attendancePercent) === false) {
                  this.attendanceBool = true;
                } else if (isNaN(this.attendancePercent)) {
                  this.attendanceBool = false;
                }

                if (isNaN(this.totalPercentAttendance) === false) {
                  this.totalAttendanceBool = true;
                } else if (isNaN(this.totalPercentAttendance)) {
                  this.totalAttendanceBool = false;
                }

                this.loading = false;
                if (this.total === this.noAttendance + this.attendance) {
                  this.loading = true;
                }
                this.arrayArray.forEach(elem => {
                  if (!this.monthArray.includes(elem["dates"])) {
                    this.monthArray.push(elem["dates"]);
                  }
                });
              });
            });
        });
      });

    // get current boolean
    this.sharingDataService
      .getCuurentBool()
      .snapshotChanges()
      .subscribe(item => {
        this.currentBool = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.currentBool.push(x);
        });
      });

    // get therappist list - turns
    this.turnosService
      .getTurnosT1()
      .snapshotChanges()
      .subscribe(item => {
        this.terapeuta1 = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.terapeuta1.push(x);
        });
      });

    this.turnosService
      .getTurnosT2()
      .snapshotChanges()
      .subscribe(item => {
        this.terapeuta2 = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.terapeuta2.push(x);
        });
      });

    this.turnosService
      .getTurnosT3()
      .snapshotChanges()
      .subscribe(item => {
        this.terapeuta3 = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.terapeuta3.push(x);
        });
      });
  }

  getDates(x) {
    this.report2Service.getReportsDate(x);
  }

  logoutUser() {
    this.authFirebaseService.logout();
  }

  selectYear(x) {}

  selectMonth(x) {}

  getRepostRequest(month, year) {
    this.selectMonth(month);
    this.selectYear(year);
    let currentMonth = month.number;
    let currentYear = year.year;
    this.report2Service
      .getReports2()
      .snapshotChanges()
      .subscribe(item => {
        this.report2List = [];
        this.arrayArray = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.report2Service
            .getReportsDate(elem.key)
            .snapshotChanges()
            .subscribe(item1 => {
              this.reporListDate = [];
              item1.forEach(e => {
                let y = e.payload.toJSON();
                y["$key"] = e.key;
                this.reporListDate.push(y);
              });
              this.reporListDate.forEach(element => {
                if (
                  element["dates"].substring(3) ===
                  `${currentMonth}/${currentYear}`
                ) {
                  this.arrayArray.push(element);
                  if (!this.report2List.includes(x)) {
                    this.report2List.push(x);
                  }
                }
                this.monthArray = [];
                this.writeIncorrect = 0;
                this.writeCorrect = 0;
                this.attendance = 0;
                this.noAttendance = 0;
                this.total = 0;
                this.writeCorrectPercent = 0;
                this.writeIncorrectPercent = 0;
                this.attendancePercent = 0;
                this.noAttendancePercent = 0;
                this.totalPercent = 0;
                this.totalPercentAttendance = 0;
                for (let index = 0; index < this.arrayArray.length; index++) {
                  if (this.arrayArray[index].assistance === false) {
                    this.noAttendance = this.noAttendance + 1;
                  } else if (this.arrayArray[index].boolMatch === true) {
                    this.writeCorrect = this.writeCorrect + 1;
                  } else if (
                    this.arrayArray[index].assistance === true &&
                    this.arrayArray[index].boolMatch === false
                  ) {
                    this.writeIncorrect = this.writeIncorrect + 1;
                  }
                  if (this.arrayArray[index].assistance === true) {
                    this.attendance = this.attendance + 1;
                  }
                }
                this.total = this.noAttendance + this.attendance;
                this.attendancePercent = Math.round(
                  (this.attendance * 100) / this.total
                );
                this.noAttendancePercent = Math.round(
                  (this.noAttendance * 100) / this.total
                );
                this.writeCorrectPercent = Math.round(
                  (this.writeCorrect * 100) / this.attendance
                );
                this.writeIncorrectPercent = Math.round(
                  (this.writeIncorrect * 100) / this.attendance
                );
                this.totalPercent =
                  this.attendancePercent + this.noAttendancePercent;
                this.totalPercentAttendance =
                  this.writeCorrectPercent + this.writeIncorrectPercent;
                if (isNaN(this.attendancePercent) === false) {
                  this.attendanceBool = true;
                } else if (isNaN(this.attendancePercent)) {
                  this.attendanceBool = false;
                }

                if (isNaN(this.noAttendancePercent) === false) {
                  this.noAttendanceBool = true;
                } else if (isNaN(this.noAttendancePercent)) {
                  this.noAttendanceBool = false;
                }

                if (isNaN(this.totalPercent) === false) {
                  this.totalPercentBool = true;
                } else if (isNaN(this.totalPercent)) {
                  this.totalPercentBool = false;
                }

                if (isNaN(this.writeCorrectPercent) === false) {
                  this.writeCorrectBool = true;
                } else if (isNaN(this.writeCorrectPercent)) {
                  this.writeCorrectBool = false;
                }

                if (isNaN(this.writeIncorrectPercent) === false) {
                  this.writeIncorrectBool = true;
                } else if (isNaN(this.writeIncorrectPercent)) {
                  this.writeIncorrectBool = false;
                }

                if (isNaN(this.attendancePercent) === false) {
                  this.attendanceBool = true;
                } else if (isNaN(this.attendancePercent)) {
                  this.attendanceBool = false;
                }

                if (isNaN(this.totalPercentAttendance) === false) {
                  this.totalAttendanceBool = true;
                } else if (isNaN(this.totalPercentAttendance)) {
                  this.totalAttendanceBool = false;
                }
              });
              this.monthArray = [];
              this.arrayArray.forEach(elem => {
                if (!this.monthArray.includes(elem["dates"])) {
                  this.monthArray.push(elem["dates"]);
                }
              });
            });
        });
      });
  }

  updateTurnSchedule(hourStart, hourEnd) {
    this.turnosService.deleteTurns();
  }

  updateCurentBool($key, currentBool) {
    this.sharingDataService.updateCurentBool($key, !currentBool);
  }

  changeStateAvailableT1($key, available) {
    this.turnosService.changeStateAvailableT1($key, !available);
  }

  changeStateAvailableT2($key, available) {
    this.turnosService.changeStateAvailableT2($key, !available);
  }

  changeStateAvailableT3($key, available) {
    this.turnosService.changeStateAvailableT3($key, !available);
  }
  updateSchedule(hourStart) {
    let sumaHour;
    this.turnosService.deleteTurns();

    if (this.terapeuta2[0].hourStart.length == 5) {
      sumaHour =
        parseInt(hourStart) -
        parseInt(this.terapeuta2[0].hourStart.slice(0, 2));
    } else {
      sumaHour =
        parseInt(hourStart) -
        parseInt(this.terapeuta2[0].hourStart.slice(0, 1));
    }

    this.terapeuta1.forEach((e, i) => {
      let currenthourEnd;
      let currenthourStart;
      let getHourInit;
      let getMinutInit;
      let getHourFin;
      let getMinutFin;
      let hour24;
      //get hour start and minut start
      if (e.hourStart.length == 5) {
        getHourInit = parseInt(e.hourStart.slice(0, 2)); //12
        getMinutInit = parseInt(e.hourStart.slice(3, 5)); //20
      } else {
        getHourInit = parseInt(e.hourStart.slice(0, 1)); //1
        getMinutInit = parseInt(e.hourStart.slice(2, 4)); //20
      }
      //get hour end and minut end
      currenthourStart = getHourInit + sumaHour;
      hour24 = currenthourStart;

      if (e.hourEnd.length == 5) {
        getHourFin = parseInt(e.hourEnd.slice(0, 2)); //12
        getMinutFin = parseInt(e.hourEnd.slice(3, 5)); //20
      } else {
        getHourFin = parseInt(e.hourEnd.slice(0, 1)); //1
        getMinutFin = parseInt(e.hourEnd.slice(2, 4)); //40
      }

      currenthourEnd = getHourFin + sumaHour;

      if (getMinutFin == 0) {
        getMinutFin = "00";
      }
      if (getMinutInit == 0) {
        getMinutInit = "00";
      }

      if (currenthourStart > 12 || currenthourStart == 0) {
        currenthourStart = this.customHourFormat(currenthourStart)    
      }
      if (currenthourEnd > 12 || currenthourEnd == 0) {   
        currenthourEnd = this.customHourFormat(currenthourEnd);    
      }
      let turno1: TurnModel = {
        $key: "",
        available: true,
        confirm: false,
        hour24: `${hour24}:${getMinutInit}`,
        hourStart: currenthourStart + ":" + getMinutInit,
        hourEnd: currenthourEnd + ":" + getMinutFin,
        therapistId: 1,
        userName: "",
        count: 0
      };
      let turno2: TurnModel = {
        $key: "",
        available: true,
        confirm: false,
        hour24: `${hour24}:${getMinutInit}`,
        hourStart: currenthourStart + ":" + getMinutInit,
        hourEnd: currenthourEnd + ":" + getMinutFin,
        therapistId: 2,
        userName: "",
        count: 0
      };
      let turno3: TurnModel = {
        $key: "",
        available: true,
        confirm: false,
        hour24: `${hour24}:${getMinutInit}`,
        hourStart: currenthourStart + ":" + getMinutInit,
        hourEnd: currenthourEnd + ":" + getMinutFin,
        therapistId: 3,
        userName: "",
        count: 0
      };
      this.turnosService.inserTurn1(turno1);
      this.turnosService.inserTurn2(turno2);
      this.turnosService.inserTurn3(turno3);
    });

    for (let index = 0; index < this.hourCoorList.length; index++) {
      let hour;
      if (index === 0 || index === 1 || index === 2) {
        if (this.hourCoorList[index].turn.length === 5) {
          hourStart > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(3);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${hourStart}:${hour}`
          );
        }
        if (this.hourCoorList[index].turn.length === 4) {
          hourStart > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(2);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${hourStart}:${hour}`
          );
        }
      }
      if (index === 3 || index === 4 || index === 5) {
        if (this.hourCoorList[index].turn.length === 5) {
          parseInt(hourStart) + 1 > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(3);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${parseInt(hourStart) + 1}:${hour}`
          );
        }
        if (this.hourCoorList[index].turn.length === 4) {
          parseInt(hourStart) + 1 > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(2);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${parseInt(hourStart) + 1}:${hour}`
          );
        }
      }
      if (index === 6 || index === 7 || index === 8) {
        if (this.hourCoorList[index].turn.length === 5) {
          parseInt(hourStart) + 2 > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(3);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${parseInt(hourStart) + 2}:${hour}`
          );
        }
        if (this.hourCoorList[index].turn.length === 4) {
          parseInt(hourStart) + 2 > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(2);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${parseInt(hourStart) + 2}:${hour}`
          );
        }
      }
      if (index === 9 || index === 10 || index === 11) {
        if (this.hourCoorList[index].turn.length === 5) {
          parseInt(hourStart) + 3 > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(3);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${parseInt(hourStart) + 3}:${hour}`
          );
        }
        if (this.hourCoorList[index].turn.length === 4) {
          parseInt(hourStart) + 3 > 12
            ? (hourStart = hourStart - 12)
            : (hourStart = hourStart);
          hour = this.hourCoorList[index].turn.substring(2);
          this.sharingDataService.updateHourCoor(
            this.hourCoorList[index].$key,
            `${parseInt(hourStart) + 3}:${hour}`
          );
        }
      }
    }
  }

  customHourFormat(hour) {
    let hourReturn = "";
    switch (hour) {
      case 0:
        hourReturn = "12";
        break;
      case 13:
        hourReturn = "1";
        break;
      case 14:
        hourReturn = "2";
        break;
      case 15:
        hourReturn = "3";
        break;
      case 16:
        hourReturn = "4";
        break;
      case 17:
        hourReturn = "5";
        break;
      case 18:
        hourReturn = "6";
        break;
      case 19:
        hourReturn = "7";
        break;
      case 20:
        hourReturn = "8";
        break;
      case 21:
        hourReturn = "9";
        break;
      case 22:
        hourReturn = "10";
        break;
      case 23:
        hourReturn = "11";
        break;
      case 24:
        hourReturn = "12";
        break;
      default:
        break;
    }
    return hourReturn;
  }
}
