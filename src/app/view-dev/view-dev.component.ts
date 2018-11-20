import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from './../services/auth-firebase.service';
import { InscriptionService } from '../services/inscription.service';
import { TurnosService } from './../services/turnos.service';
import { element } from 'protractor';
import { UserService } from './../services/user.service';
import { SharingDataService } from './../services/sharing-data.service';




@Component({
  selector: 'app-view-dev',
  templateUrl: './view-dev.component.html',
  styleUrls: ['./view-dev.component.css']
})
export class ViewDevComponent implements OnInit {
  public isLogin: boolean;
  public emailUser: string;
  public show: boolean;
  inscriptionList: any[];
  terapeuta1: any[];
  terapeuta2: any[];
  terapeuta3: any[];
  userList: any[];
  currentBool: any[];
  public changeBool: boolean;
  
  constructor(
    private authFirebaseService: AuthFirebaseService,
    private inscriptionService: InscriptionService,
    private turnoService: TurnosService,
    private userService: UserService,
    private sharingDataService: SharingDataService
  ) { }

  ngOnInit() {
    this.isLogin = false;
    this.authFirebaseService.getAuth().subscribe(auth => {
      if (auth) {
        this.emailUser = auth.email;
        this.isLogin = true;
        if (auth.email === 'mllamocca@inteligogroup.com' || auth.email === 'acabrera@inteligogroup.com') {
          this.show = true;
        } else if (auth.email == undefined || auth.email == null) {
          this.show = false;
        }
      }
    });

      
    // get inscriptions
    this.inscriptionService.getInscriptions()
    .snapshotChanges()
    .subscribe(item => {
      this.inscriptionList = [];
      item.forEach( elem => {
        let x = elem.payload.toJSON();
        x["$key"] = elem.key;
        this.inscriptionList.push(x)
      })
    })

    // get current boolean
    this.sharingDataService.getCuurentBool()
    .snapshotChanges()
    .subscribe( item => {
      this.currentBool = [];
      item.forEach( elem => {
        let x = elem.payload.toJSON();
        x['$key'] = elem.key;
        this.currentBool.push(x)
      })      
    })

    // get therappist list - turns 
    this.turnoService.getTurnosT1()
      .snapshotChanges()
      .subscribe(item => {   
        this.terapeuta1 = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.terapeuta1.push(x);
        });
      });

      this.turnoService.getTurnosT2()
      .snapshotChanges()
      .subscribe(item => {
        this.terapeuta2 = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.terapeuta2.push(x);
        });        
      });

      this.turnoService.getTurnosT3()
      .snapshotChanges()
      .subscribe(item => {
        this.terapeuta3 = [];
        item.forEach(elem => {
          let x = elem.payload.toJSON();
          x["$key"] = elem.key;
          this.terapeuta3.push(x);
        });
      });

      // get user list
      this.userService.getUser()
      .snapshotChanges()
      .subscribe(item => {
        this.userList = [];
        item.forEach( elem => {
          let x = elem.payload.toJSON();
          x['$key'] = elem.key;
          this.userList.push(x);
        })
      })
  }

  logoutUser() {
    this.authFirebaseService.logout();
  }

  deleteListInscription() {
    this.inscriptionList.forEach(element => {
      this.inscriptionService.deleteInscription(element['$key'])
      
    });
  }

  updateTurnsT1() {
    this.terapeuta1.forEach( element => {
      this.turnoService.updatet1Turn1(element['$key']);
    })

    this.terapeuta2.forEach( element => {
      this.turnoService.updatet2Turn1(element['$key']);
    })

    this.terapeuta3.forEach( element => {
      this.turnoService.updatet3Turn1(element['$key']);
    })
  }

  updateUserReset() {
    this.userList.forEach( element => {
      this.userService.updateUserReset(element['$key']);
    })    
  }

  updateCurentBool($key, currentBool) {
    this.sharingDataService.updateCurentBool($key, !currentBool)
  }

  changeStateAvailableT1($key, available) {
    this.turnoService.changeStateAvailableT1($key, !available);
  }

  changeStateAvailableT2($key, available) {
    this.turnoService.changeStateAvailableT2($key, !available);
  }

  changeStateAvailableT3($key, available) {
    this.turnoService.changeStateAvailableT3($key, !available);
  }

}
