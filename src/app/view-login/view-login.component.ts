import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.css']
})
export class ViewLoginComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  onLogin() {
    this.authService.login();
  }

}
