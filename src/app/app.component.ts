import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './services/login/login.service';
import { RecoveryService } from './services/recovery/recovery.service';
import { AccountManagerService } from './services/accountManager/account-manager.service';
import { Logout } from './classes/logout/logout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mgcms';
  public logoutS: Logout;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private recovery: RecoveryService,
    public accountManager: AccountManagerService,
  ) {
    this.logoutS = new Logout(this.loginService, this.router);
    const that = this;
    this.updateTimeZone();
    setInterval(() => {
      that.updateTimeZone();
    }, 300000);
  }

  public updateTimeZone() {
    this.accountManager.updateTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone.toString()).subscribe(
      data => {
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.router.navigate(['public/home']);
  }

  logout() {
    this.logoutS.do();
  }
}
