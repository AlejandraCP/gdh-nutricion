import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Observable, Subject } from "rxjs";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";

// services
import { HomeService } from "../home/home.service";
import { AuthService } from "../auth/auth.service";
import { TurnosService } from "./../services/turnos.service";
import { InscriptionService } from "./../services/inscription.service";
import { UserService } from "./../services/user.service";
import { Report2Service } from "./../services/report2.service";
import { SharingDataService } from "./../services/sharing-data.service";
import { EditionsService } from "./../services/editions.service";

// models
import { InscripcionModel } from "./../models/inscriptions";
import { TurnModel } from "./../models/turns";
import { UserModel } from "./../models/users";
import { Report2Model } from "./../models/report2";
import { log } from "util";

@Component({
  selector: "app-view-home",
  templateUrl: "./view-home.component.html",
  styleUrls: ["./view-home.component.css"]
})
export class ViewHomeComponent implements OnInit {
  @ViewChild(ToastContainerDirective)
  toastContainer: ToastContainerDirective;
  private _success = new Subject<string>();
  events: MicrosoftGraph.Event;
  me: MicrosoftGraph.User;
  message: MicrosoftGraph.Message;
  emailSent: Boolean;
  calendarSent: Boolean;
  subsGetUsers: Subscription;
  subsGetMe: Subscription;
  subsGetEventsMe: Subscription;
  subsSendMail: Subscription;
  send: MicrosoftGraph.Event;
  subsSendCalendar: Subscription;
  subsCounter: Subscription;
  dateIni: any;
  dateFin: any;
  terapeuta1: any[];
  inscriptionList: any[];
  reportList: any[];
  report2List: any[];
  reporListDate: any[];
  msgEditionList: any[];
  userList: any[];
  selectedTurn: TurnModel;
  selectedUser: UserModel;
  closeResult: string;
  today: any;
  dd: any;
  mm: any;
  yyyy: any;
  name: string;
  userName: string;
  lastName: string;
  displayName: string;
  countConfirm: number = 0;
  modalSelectTurn: NgbModalRef;
  modalConfirm: NgbModalRef;
  modalOnMessage: NgbModalRef;
  modalUser: any;
  therapistIds: Array<string> = ["terapeuta1"];
  returnThis: boolean = false;
  mail: string;
  ticks: number;
  staticAlertClosed = false;
  successMessage: string;
  bool: boolean;
  progres: boolean;
  public activateModalConfirm: boolean;
  messageAuth: boolean;
  public changeBool: boolean;
  public editionsMsg: string;
  currentBool: any[];
  currentTime: any[];
  currentDate: string;

  primero: InscripcionModel = {
    $key: "",
    dateInscription: "",
    hourStart: "",
    hourEnd: "",
    userName: "",
    userAssist: "",
    therapist: 0,
    boolAny: false,
    stringVal: "",
    type: "text",
    displayName: "",
    mail: "dfs"
  };

  user: UserModel = {
    $key: "",
    mail: "",
    reserved: false,
    countReserved: 0,
    countAgendas: 0,
    messageEvent: ""
  };

  turno: TurnModel = {
    $key: "",
    available: true,
    confirm: false,
    hourStart: "",
    hourEnd: "",
    therapistId: 0,
    userName: "",
    count: 0,
    turnId: "",
    hour24:''
  };

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private turnoService: TurnosService,
    private inscriptionService: InscriptionService,
    private report2Service: Report2Service,
    private userService: UserService,
    private modalService: NgbModal,
    private sharingDataService: SharingDataService,
    private editionsService: EditionsService
  ) {
  }

  ngOnInit() {
    this.bool = false;
    this.progres = true;
    this.activateModalConfirm = false;
    this.messageAuth = false;
    if (this.bool === false) {
      setTimeout(() => {
        this.messageAuth = true;
        this.progres = false;
      }, 2000);
    }

    this.subsGetMe = this.homeService.getMe().subscribe(objectMe => {
      this.me = objectMe;
      let cutName = objectMe.mail.indexOf("@");
      let cutUserName = objectMe.displayName.indexOf(" ");
      let cutDisplayName = objectMe.displayName.indexOf(",");
      this.name = objectMe.mail.substring(0, cutName);
      this.lastName = objectMe.displayName.substring(0, cutDisplayName);
      this.userName = objectMe.displayName.substring(cutUserName + 1);
      this.displayName = objectMe.displayName;
      this.mail = objectMe.mail;
      if (this.mail == "undefined") {
        this.bool = false;
        alert("cargando");
        setTimeout(() => {
          // this.progres = true;
          this.userService
            .getUser()
            .snapshotChanges()
            .subscribe(item => {
              this.userList = [];
              item.forEach(elem => {
                let x = elem.payload.toJSON();
                x["$key"] = elem.key;
                this.userList.push(x);
              });
              this.userList.forEach(elem => {
                if (elem.mail === this.me.mail) {
                  this.returnThis = true;
                }
              });
            });
        }, 30000);
      } else {
        this.bool = true;
        this.progres = false;
        this.userService
          .getUser()
          .snapshotChanges()
          .subscribe(item => {
            this.userList = [];
            item.forEach(elem => {
              let x = elem.payload.toJSON();
              x["$key"] = elem.key;
              this.userList.push(x);
            });

            this.userList.forEach(elem => {
              if (elem.mail === this.me.mail) {
                this.returnThis = true;
              }
            });
          });
      }
    });

    // send name and nameUser to local storage
    localStorage.setItem("name", this.name);
    localStorage.setItem("userName", this.userName);

    this.turnoService
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

    //get msg edition
    this.editionsService.getMsgEditions()
    .snapshotChanges()
    .subscribe( item => {
      this.msgEditionList = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x['$key'] = element.key;
        this.msgEditionList.push(x)
      });
      this.msgEditionList.forEach(element => {
        if (element.id == 1) {
          this.editionsMsg = element.msg;
        }
      });
    });

    // get inscriptions
    this.inscriptionService
      .getInscriptions()
      .snapshotChanges()
      .subscribe(item => {
        this.inscriptionList = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.inscriptionList.push(x);
        });
      });

    //get reports2
    this.report2Service
      .getReports2()
      .snapshotChanges()
      .subscribe(item => {
        this.report2List = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.report2List.push(x);
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

      this.sharingDataService
      .getCuurentTime()
      .snapshotChanges()
      .subscribe(item => {
        this.currentTime = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.currentTime.push(x);
        });
        this.getTime();
      });

    let dateCurrent = new Date();
  }

  ngOnDestroy() {
    this.subsGetUsers.unsubscribe();
  }

  getTime() {
    setInterval(()  => {
      let date = new Date();
      let hour:any = date.getHours();
      let minute:any = date.getMinutes();
      if ( minute < 10 ) {
        minute = '0' + minute.toString();
      } else if (minute > 10) {
        minute = minute.toString();
      }
      let currentDate = `${hour}:${minute}` 
      this.sharingDataService.updateCurentTiem(this.currentTime[0].$key,currentDate);
    },30000)
  }

  onSendCalendar(user: UserModel) {
    let date = new Date();
    let getFullYear = date.getFullYear();
    let getMonth = date.getMonth();
    let getDay = date.getDate();
    let getHourInit;
    let getMinutInit;
    let getHourFin;
    let getMinutFin;

    if (this.selectedTurn.hourStart.length == 5) {
      getHourInit = parseInt(this.selectedTurn.hourStart.slice(0, 2));
      getMinutInit = parseInt(this.selectedTurn.hourStart.slice(3, 5));
    } else {
      getHourInit = parseInt(this.selectedTurn.hourStart.slice(0, 1)) + 12;
      getMinutInit = parseInt(this.selectedTurn.hourStart.slice(2, 4));
    }

    if (this.selectedTurn.hourEnd.length == 5) {
      getHourFin = parseInt(this.selectedTurn.hourEnd.slice(0, 2));
      getMinutFin = parseInt(this.selectedTurn.hourEnd.slice(3, 5));
    } else {
      getHourFin = parseInt(this.selectedTurn.hourEnd.slice(0, 1)) + 12;
      getMinutFin = parseInt(this.selectedTurn.hourEnd.slice(2, 4));
    }

    this.dateIni = new Date(
      getFullYear,
      getMonth,
      getDay,
      getHourInit,
      getMinutInit
    );
    this.dateFin = new Date(
      getFullYear,
      getMonth,
      getDay,
      getHourFin,
      getMinutFin
    );

    user.countReserved++;
    user.countAgendas++;
    user.messageEvent =
      "Consulta Nutricional";
    this.updateUser(user.$key, user);

    let send;
    send = {
      iCalUId:
        this.selectedUser.mail +
        "-" +
        this.selectedTurn.hourStart +
        "-" +
        this.selectedTurn.hourEnd,
      subject:
        "Consulta Nutricional",
      start: {
        dateTime: this.dateIni,
        timeZone: "GMT-0500"
      },
      end: {
        dateTime: this.dateFin,
        timeZone: "GMT-0500"
      }
    };

    this.send = send;
    this.subsSendCalendar = this.homeService
      .sendCalendar(this.send)
      .subscribe();
  }

  onSelectTurn1(user: UserModel, turn: TurnModel, modal): void {

    let userExist = false;

    let report2: Report2Model = {
      $key: "",
      dates: ["report1234"],
      name: this.userName,
      lastName: this.lastName,
      mail: this.mail
    };

    this.user.mail = this.me.mail;

    this.userList.forEach(elem => {
      if (elem.mail === this.me.mail) {
        userExist = true;
      }
    });

    if (userExist == false) {
      this.insertUser(this.user);
      this.insertReport2(report2);
    }
    this.selectedTurn = turn;
    this.selectedTurn.available = false;
    this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);

    this.terapeuta1.forEach(element => {
      if (this.selectedTurn.turnId == element.turnId) {
        if (element.confirm == true) {
          this.activateModalConfirm = true;
        }
      }
    });

    this.modalSelectTurn = this.modalService.open(modal);
    this.modalSelectTurn.result.then(
      result => {
        this.terapeuta1.forEach(element => {
          if (this.selectedTurn.turnId == element.turnId) {
            if (element.confirm == false) {
              this.selectedTurn.available = true;
              this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
              this.subsCounter.unsubscribe();
              this.closeResult = `Closed with: ${result}`;
            }
            else if (element.confirm == true) {
              this.subsCounter.unsubscribe();
              this.closeResult = `Closed with: ${result}`;
            }
          }
        });
      },
      reason => {
        this.terapeuta1.forEach(element => {
          if (this.selectedTurn.turnId == element.turnId) {
            if (element.confirm == false) {
              this.selectedTurn.available = true;
              this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
              this.subsCounter.unsubscribe();
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
            else if (element.confirm == true) {
              this.subsCounter.unsubscribe();
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          }
        });
      }
    );

    let timer;
    this.ticks = 60;

    timer = Observable.timer(1000, 1000);
    this.subsCounter = timer.subscribe(t => {
      this.ticks--;
      if (this.ticks == 0) {
        this.modalSelectTurn.close();
      }
    });
  }

  onConfirmTurn1(user: UserModel, x, modal, modalTurnoOcupado) {
    this.activateModalConfirm = false;

    this.modalSelectTurn.close();
    this.modalConfirm = this.modalService.open(modal);

    this.selectedUser = user;
    this.selectedUser.reserved = true;
    
    this.selectedTurn.confirm = true;
    this.selectedTurn.userName = this.name;
    
    this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);

    const timeOut = Observable.timer(3000);

    timeOut.subscribe( t => {
 
      let userNameLocal = this.me.mail.substring(0, this.me.mail.indexOf("@"));
      
      //get turn list
      this.turnoService
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
      
      this.terapeuta1.forEach((e)=>{
        if( this.selectedTurn.turnId == e.turnId && e.userName == userNameLocal){
          this.primero.dateInscription = this.getDateFull();
          this.primero.hourStart = this.selectedTurn.hourStart;
          this.primero.hourEnd = this.selectedTurn.hourEnd;
          this.primero.therapist = this.selectedTurn.therapistId;
          this.primero.userAssist = this.userName;
          this.primero.userName = this.name;
          this.primero.displayName = this.displayName;
          this.primero.mail = this.mail;
    
          this.insertInscription(x);
          // this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
          this.updateUser(user.$key, this.selectedUser);

          this.modalConfirm.result.then(
            result => {
              this.closeResult = `Closed with: ${result}`;
              this.selectedTurn.count++;
              // this.selectedTurn.available = true;
              this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
              this.subsCounter.unsubscribe();
            },
            reason => {
              this.selectedTurn.count++;
              // this.selectedTurn.available = true;
              this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              this.subsCounter.unsubscribe();
            }
          );
          this.activateModalConfirm = true;
        }
        
        if( this.selectedTurn.turnId == e.turnId && e.userName !== userNameLocal){
          this.modalConfirm.close();
          this.modalOnMessage = this.modalService.open(modalTurnoOcupado);
          this.modalOnMessage.result.then(
            result => {
              this.selectedUser.reserved = false;
              this.updateUser(user.$key, this.selectedUser);
              this.subsCounter.unsubscribe();
              this.closeResult = `Closed with: ${result}`;
            },
            reason => {
              this.selectedUser.reserved = false;
              this.updateUser(user.$key, this.selectedUser);
              this.subsCounter.unsubscribe();
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
          this.activateModalConfirm = false;
        }
      })
    });
  }

  onMessageSelect(modal) {
    let modalMessageUserReserved;
    modalMessageUserReserved = this.modalService.open(modal);
    modalMessageUserReserved.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
        this.subsCounter.unsubscribe();
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.subsCounter.unsubscribe();
      }
    );
  }

  cancelTurn1(user: UserModel, inscription: InscripcionModel) {
    this.selectedTurn.available = true;
    this.selectedTurn.confirm = false;
    this.selectedTurn.userName = "";
    this.selectedTurn.count = 0;
    user.reserved = false;
    if (user.countReserved >= 1) {
      user.countReserved--;
    }

    this.subsGetEventsMe = this.homeService
      .getEventMe()
      .subscribe(ObjEventsMe => {
        let arrayEvents = [];
        arrayEvents = ObjEventsMe["value"];
        arrayEvents.forEach(elem => {
          if (elem.subject === user.messageEvent) {
            this.homeService.deleteEventMe(elem.id);
          }
        });
      });

    this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
    this.updateUser(user.$key, user);
    this.onDelete(inscription.$key);
    this.modalSelectTurn.close();
    this.subsCounter.unsubscribe();
    if (this.modalConfirm) {
      this.modalConfirm.close();
      this.modalConfirm.result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.selectedTurn.count = 0;
          this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      this.subsCounter.unsubscribe();
    }
  }

  insertInscription(x) {
    if (InscripcionModel) {
      this.inscriptionService.insertInscription(x);
    }
  }

  insertUser(x) {
    if (UserModel) {
      this.userService.insertUser(x);
    }
  }

  insertReport2(x) {
    if (Report2Model) {
      this.report2Service.insertReport2(x);
    }
  }

  updateTurn1(key, x) {
    this.turnoService.updateTurn1(key, x);
  }

  updateUser(key, x) {
    this.userService.updateUser(key, x);
  }

  onDelete($key: string) {
    this.inscriptionService.deleteInscription($key);
  }

  onLogout() {
    this.authService.logout();
  }

  private getDismissReason(reason: any): string {
    this.subsCounter.unsubscribe();
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  private getDateFull(): string {
    this.today = new Date();
    this.dd = this.today.getDate();
    this.mm = this.today.getMonth() + 1;
    this.yyyy = this.today.getFullYear();

    if (this.dd < 10) {
      this.dd = "0" + this.dd;
    }
    if (this.mm < 10) {
      this.mm = "0" + this.mm;
    }
    this.today = this.dd + "/" + this.mm + "/" + this.yyyy;

    return this.today;
  }

  //update users
  updateUsersAdmin() {
    this.userService
      .getUser()
      .snapshotChanges()
      .subscribe(item => {
        this.userList = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.userList.push(x);
        });
        this.userList.forEach(elem => {
          if (elem.mail === this.me.mail) {
            this.returnThis = true;
          }
        });
      });
  }
}
