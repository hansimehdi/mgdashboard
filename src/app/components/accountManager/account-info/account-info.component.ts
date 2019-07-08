import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../services/login/login.service';
import { LanguageService } from '../../../services/language/language.service';
import { AccountManagerService } from '../../../services/accountManager/account-manager.service';
import { Account } from '../../../interfaces/account/account';
import { LogsManagerService } from '../../../services/logsManager/logs-manager.service';
import { GlobalService } from '../../../services/globalConf/global.service';

import { Logs } from '../../../interfaces/logs/logs';
import { Logout } from '../../../classes/logout/logout';



@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  public showProgress: boolean;
  public lang: string;
  public accountId: string;
  public accountData: Account;
  public accountPictures;
  public accountNotFound: boolean;
  public startLogs: number;
  public perPageLogs: number;
  public accountLogs: Logs[] = [];
  public logsCount: number;
  public permitLoading: boolean;
  public isLoading: boolean;
  public logoutS: Logout;
  public showLogs: boolean;
  public serverBase: string;
  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private languageSwitcher: LanguageService,
    private translate: TranslateService,
    private accountManager: AccountManagerService,
    private logsManager: LogsManagerService,
    private location: Location,
    private gs: GlobalService
  ) {
    this.showProgress = false;
    this.showLogs = false;
    this.lang = '';
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.accountNotFound = true;
    this.startLogs = 0;
    this.perPageLogs = 10;
    this.logsCount = 0;
    this.permitLoading = false;
    this.isLoading = false;
    this.logoutS = new Logout(this.loginService, this.router);
    this.serverBase = this.gs.getUrl();
  }

  ngOnInit() {
    this.lang = this.languageSwitcher.getLang();
    this.translate.setDefaultLang(this.lang);
    this.showProgress = true;
    this.accountManager.getAccount(this.accountId).subscribe(
      data => {
        this.accountData = data.account;
        if (this.accountData.firstname.length > 0) {
          if (data.pictures.data.length > 0) {
            this.accountPictures = data.pictures.data[0].url;
          }
          this.accountNotFound = false;
        } else {
          this.accountNotFound = true;
        }
      },
      fail => {
        this.showProgress = false;
        switch (fail) {
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
        }
      }
    );
    this.logsManager.getAccountLogs(this.accountId, this.startLogs, this.perPageLogs).subscribe(
      data => {
        this.accountLogs = data.logs;
        this.logsCount = data.count;
        if (this.logsCount === 0) {
          this.showLogs = true;
        }
        if (data.count <= data.logs.length) {
          this.permitLoading = false;
        } else {
          this.permitLoading = true;
        }
        this.showProgress = false;
      },
      error => {
        this.showProgress = false;
        switch (error) {
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
        }
      }
    );
  }

  loadMoreLogs() {
    this.isLoading = true;
    this.startLogs = this.startLogs + 10;
    this.logsManager.getAccountLogs(this.accountId, this.startLogs, this.perPageLogs).subscribe(
      data => {
        for (let i = 0; i < data.logs.length; i++) {
          this.accountLogs.push(data.logs[i]);
        }
        this.logsCount = data.count;
        if (data.count <= this.startLogs) {
          this.permitLoading = false;
        } else {
          this.permitLoading = true;
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        switch (error) {
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
        }
      }
    );
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.logoutS.do();
  }
}
