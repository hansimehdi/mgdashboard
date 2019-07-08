import { Component, OnInit, EventEmitter, Output, Injectable } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../services/login/login.service';
import { LanguageService } from '../../../services/language/language.service';
import { LogsManagerService } from '../../../services/logsManager/logs-manager.service';
import { Logout } from '../../../classes/logout/logout';
import { Logs } from '../../../interfaces/logs/logs';
@Component({
  selector: 'app-logs-all',
  templateUrl: './logs-all.component.html',
  styleUrls: ['./logs-all.component.css']
})
export class LogsAllComponent implements OnInit {
  public showProgress: boolean;
  public lang: string;
  public accountNotFound: boolean;
  public startLogs: number;
  public perPageLogs: number;
  public Logs: Logs[];
  public logsCount: number;
  public permitLoading: boolean;
  public isLoading: boolean;
  public pageLoading: boolean;
  public logoutS: Logout;
  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private languageSwitcher: LanguageService,
    private translate: TranslateService,
    private logsManager: LogsManagerService,
    private location: Location
  ) {
    this.showProgress = false;
    this.pageLoading = true;
    this.permitLoading = false;
    this.isLoading = false;
    this.startLogs = 0;
    this.perPageLogs = 10;
    this.logoutS = new Logout(this.loginService, this.router);
  }

  ngOnInit() {
    this.showProgress = true;
    this.logsManager.getLogs(this.startLogs, this.perPageLogs).subscribe(
      data => {
        this.showProgress = false;
        this.pageLoading = false;
        this.Logs = data.logs;
        this.logsCount = data.count;
        if (data.count <= data.logs.length) {
          this.permitLoading = false;
        } else {
          this.permitLoading = true;
        }
      },
      error => {
        this.showProgress = false;
        this.pageLoading = false;
        switch (error) {
          case 401:
            this.logoutS.do();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      }
    );
  }

  loadMoreLogs() {
    this.isLoading = true;
    this.startLogs = this.startLogs + 10;
    this.logsManager.getLogs(this.startLogs, this.perPageLogs).subscribe(
      data => {
        for (let i = 0; i < data.logs.length; i++) {
          this.Logs.push(data.logs[i]);
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
            this.logoutS.do();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      }
    );
  }

  goAccountInfo(id: string) {
    this.router.navigate(['accountinfo/', id], { relativeTo: this.route.parent });
  }

  logout() {
    this.logoutS.do();
  }
}
