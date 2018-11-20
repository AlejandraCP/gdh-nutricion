import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Observable, Subject } from "rxjs";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
  NgbCarouselConfig
} from "@ng-bootstrap/ng-bootstrap";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";

// services
import { HomeService } from "../home/home.service";
import { AuthService } from "../auth/auth.service";
import { TurnosService } from "./../services/turnos.service";
import { InscriptionService } from "./../services/inscription.service";
import { ReportService } from "./../services/report.service";
import { UserService } from "./../services/user.service";
import { Report2Service } from "./../services/report2.service";
import { SharingDataService } from "./../services/sharing-data.service";

// models
import { InscripcionModel } from "./../models/inscriptions";
import { ReportsModel } from "./../models/reports";
import { TurnModel } from "./../models/turns";
import { UserModel } from "./../models/users";
import { Report2Model } from "./../models/report2";
import { ReportDateModel } from "./../models/report-date";
import { LoginComponent } from "../login/login.component";
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
  terapeuta2: any[];
  terapeuta3: any[];
  inscriptionList: any[];
  reportList: any[];
  report2List: any[];
  reporListDate: any[];
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
  therapistIds: Array<string> = ["terapeuta1", "terapeuta2", "terapeuta3"];
  returnThis: boolean = false;
  mail: string;
  ticks: number;
  staticAlertClosed = false;
  successMessage: string;
  bool: boolean;
  progres: boolean;
  messageAuth: boolean;
  public changeBool: boolean;
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
    hour24:'',
    count: 0
  };

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private turnoService: TurnosService,
    private inscriptionService: InscriptionService,
    private reportService: ReportService,
    private report2Service: Report2Service,
    private userService: UserService,
    private modalService: NgbModal,
    private carouselConfig: NgbCarouselConfig,
    private sharingDataService: SharingDataService
  ) {
    carouselConfig.interval = 1000000;
    carouselConfig.wrap = true;
    carouselConfig.keyboard = true;
  }

  ngOnInit() {
    this.bool = false;
    this.progres = true;
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

    this.turnoService
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

    this.turnoService
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

    // get reports
    this.reportService
      .getReports()
      .snapshotChanges()
      .subscribe(item => {
        this.reportList = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.reportList.push(x);
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
    let hourCurrent = dateCurrent.getHours();
    let minuteCurrent = dateCurrent.getMinutes();
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
      "Masajes antiestrés - Terapeuta " + this.selectedTurn.therapistId;
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
        "Masajes antiestrés - Terapeuta " + this.selectedTurn.therapistId,
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

    this.modalSelectTurn = this.modalService.open(modal);
    this.modalSelectTurn.result.then(
      result => {
        this.selectedTurn.available = true;
        this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
        this.subsCounter.unsubscribe();
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.selectedTurn.available = true;
        this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
        this.subsCounter.unsubscribe();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  onSelectTurn2(user: UserModel, turn: TurnModel, modal): void {

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
    this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);

    this.modalSelectTurn = this.modalService.open(modal);
    this.modalSelectTurn.result.then(
      result => {
        this.selectedTurn.available = true;
        this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
        this.subsCounter.unsubscribe();
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.selectedTurn.available = true;
        this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
        this.subsCounter.unsubscribe();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  onSelectTurn3(user: UserModel, turn: TurnModel, modal): void {

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
    this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);

    this.modalSelectTurn = this.modalService.open(modal);
    this.modalSelectTurn.result.then(
      result => {
        this.selectedTurn.available = true;
        this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
        this.subsCounter.unsubscribe();
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.selectedTurn.available = true;
        this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
        this.subsCounter.unsubscribe();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
    if (this.selectedTurn.confirm == true) {
      this.modalSelectTurn.close();
      this.modalOnMessage = this.modalService.open(modalTurnoOcupado);
      this.modalOnMessage.result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.subsCounter.unsubscribe();
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.subsCounter.unsubscribe();
        }
      );
    } else {
      this.selectedUser = user;
      this.selectedUser.reserved = true;
      this.selectedTurn.confirm = true;
      this.selectedTurn.userName = this.name;

      this.primero.dateInscription = this.getDateFull();
      this.primero.hourStart = this.selectedTurn.hourStart;
      this.primero.hourEnd = this.selectedTurn.hourEnd;
      this.primero.therapist = this.selectedTurn.therapistId;
      this.primero.userAssist = this.userName;
      this.primero.userName = this.name;
      this.primero.displayName = this.displayName;
      this.primero.mail = this.mail;

      this.insertInscription(x);
      this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
      this.updateUser(user.$key, this.selectedUser);

      this.modalSelectTurn.close();
      this.modalConfirm = this.modalService.open(modal);
      this.modalConfirm.result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.subsCounter.unsubscribe();
          this.selectedTurn.available = true;
          this.selectedTurn.count++;
          this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.selectedTurn.available = true;
          this.selectedTurn.count++;
          this.updateTurn1(this.selectedTurn.$key, this.selectedTurn);
          this.subsCounter.unsubscribe();
        }
      );
    }
  }

  onConfirmTurn2(user: UserModel, x, modal, modalTurnoOcupado) {
    if (this.selectedTurn.confirm == true) {
      this.modalSelectTurn.close();
      this.modalOnMessage = this.modalService.open(modalTurnoOcupado);
      this.modalOnMessage.result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.subsCounter.unsubscribe();
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.subsCounter.unsubscribe();
        }
      );
    } else {
      this.selectedUser = user;
      this.selectedUser.reserved = true;

      this.selectedTurn.confirm = true;
      this.selectedTurn.userName = this.name;

      this.primero.dateInscription = this.getDateFull();
      this.primero.hourStart = this.selectedTurn.hourStart;
      this.primero.hourEnd = this.selectedTurn.hourEnd;
      this.primero.therapist = this.selectedTurn.therapistId;
      this.primero.userAssist = this.userName;
      this.primero.userName = this.name;
      this.primero.displayName = this.displayName;
      this.primero.mail = this.mail;

      this.insertInscription(x);
      this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
      this.updateUser(user.$key, this.selectedUser);

      this.modalSelectTurn.close();
      this.modalConfirm = this.modalService.open(modal);
      this.modalConfirm.result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.selectedTurn.count++;
          this.selectedTurn.available = true;
          this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
          this.subsCounter.unsubscribe();
        },
        reason => {
          this.selectedTurn.count++;
          this.selectedTurn.available = true;
          this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.subsCounter.unsubscribe();
        }
      );
    }
  }

  onConfirmTurn3(user: UserModel, x, modal, modalTurnoOcupado) {
    if (this.selectedTurn.confirm == true) {
      this.modalSelectTurn.close();
      this.modalOnMessage = this.modalService.open(modalTurnoOcupado);
      this.modalOnMessage.result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.subsCounter.unsubscribe();
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.subsCounter.unsubscribe();
        }
      );
    } else {
      this.selectedUser = user;
      this.selectedUser.reserved = true;
      this.selectedTurn.confirm = true;
      this.selectedTurn.userName = this.name;

      this.primero.dateInscription = this.getDateFull();
      this.primero.hourStart = this.selectedTurn.hourStart;
      this.primero.hourEnd = this.selectedTurn.hourEnd;
      this.primero.therapist = this.selectedTurn.therapistId;
      this.primero.userAssist = this.userName;
      this.primero.userName = this.name;
      this.primero.displayName = this.displayName;
      this.primero.mail = this.mail;

      this.insertInscription(x);
      this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
      this.updateUser(user.$key, this.selectedUser);

      this.modalSelectTurn.close();
      this.modalConfirm = this.modalService.open(modal);
      this.modalConfirm.result.then(
        result => {
          this.selectedTurn.available = true;
          this.selectedTurn.count++;
          this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
          this.closeResult = `Closed with: ${result}`;
          this.subsCounter.unsubscribe();
        },
        reason => {
          this.selectedTurn.available = true;
          this.selectedTurn.count++;
          this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.subsCounter.unsubscribe();
        }
      );
    }
  }

  onMessageSelect(modal) {
    this.modalOnMessage = this.modalService.open(modal);
    this.modalOnMessage.result.then(
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

  cancelTurn2(user: UserModel, inscription: InscripcionModel) {
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

    this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
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
          this.updateTurn2(this.selectedTurn.$key, this.selectedTurn);
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      this.subsCounter.unsubscribe();
    }
  }

  cancelTurn3(user: UserModel, inscription: InscripcionModel) {
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

    this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
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
          this.updateTurn3(this.selectedTurn.$key, this.selectedTurn);
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

  insertReport(x) {
    if (ReportsModel) {
      this.reportService.insertReport(x);
    }
  }

  insertUser(x) {
    if (UserModel) {
      this.userService.insertUser(x);
    }
  }

  insertTurn2(x) {
    if (TurnModel) {
      this.turnoService.inserTurn2(x);
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

  updateTurn2(key, x) {
    this.turnoService.updateTurn2(key, x);
  }

  updateTurn3(key, x) {
    this.turnoService.updateTurn3(key, x);
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
