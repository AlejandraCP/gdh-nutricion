/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ViewHomeComponent } from './view-home/view-home.component';
import { LoginFbComponent } from './login-fb/login-fb.component';
import { ViewCoorComponent } from './view-coor/view-coor.component';
import { ViewAdminComponent } from './view-admin/view-admin.component';
import { ViewLoginComponent } from './view-login/view-login.component';
import { ViewDevComponent } from './view-dev/view-dev.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

import { HttpService } from './shared/http.service';
import { AuthService } from './auth/auth.service';
import { HomeService } from './home/home.service';
import { TurnosService } from './services/turnos.service';
import { ReportService } from './services/report.service';
import { Report2Service } from './services/report2.service';
import { InscriptionService } from './services/inscription.service';
import { AuthFirebaseService } from './services/auth-firebase.service';
import { UserService } from './services/user.service';
import { SharingDataService } from './services/sharing-data.service';
import { TurnsStateService } from './services/turns-state.service';



// import angular firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// enviroment - config firebase
import { environment } from '../environments/environment';

// guard
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: ViewLoginComponent },
  { path: 'home', component: ViewHomeComponent },
  { path: 'login', component: LoginFbComponent },
  { path: 'coordi', component: ViewCoorComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: ViewAdminComponent, canActivate: [AuthGuard] },
  { path: 'dev', component: ViewDevComponent, canActivate: [AuthGuard]},
  {path: '**', component: NotFoundPageComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ViewLoginComponent,
    ViewHomeComponent,
    LoginFbComponent,
    ViewCoorComponent,
    ViewAdminComponent,
    NotFoundPageComponent,
    ViewDevComponent
  ],
  imports: [
AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true}),
    NgbModule.forRoot()
  ],
  providers: [
    HttpService,
    AuthService,
    AuthGuard,
    HomeService,
    InscriptionService,
    TurnosService,
    ReportService,
    Report2Service,
    InscriptionService,
    AuthFirebaseService,
    UserService,
    SharingDataService,
    TurnsStateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
