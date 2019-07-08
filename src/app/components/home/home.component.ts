import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';

import { CenterAccount } from 'src/app/classes/center/center-account';
import { EnterpriseAccount } from 'src/app/classes/enterprise/enterprise-account';
import { CenterManagerService } from 'src/app/services/center/center-manager.service';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';

import { Logout } from '../../classes/logout/logout';
import { AccountManagerService } from '../../services/accountManager/account-manager.service';
import { AdminpccService } from '../../services/adminParentChildConnector/adminpcc.service';
import { GlobalService } from '../../services/globalConf/global.service';
import { LanguageService } from '../../services/language/language.service';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public serverBase: string;
  public centers: CenterAccount[];
  public showProgress: boolean;
  public enterprises: EnterpriseAccount[];

  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private languageSwitcher: LanguageService,
    private translate: TranslateService,
    public connector: AdminpccService,
    public accountManager: AccountManagerService,
    private gs: GlobalService,
    private loginService: LoginService,
    private enterpriseManager: EnterpriseManagerService,
    private centerManager: CenterManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.showProgress = false;
  }

  enterpriseInfo(id) {
    this.router.navigate(['enterpriseinfo/', id], {
      relativeTo: this.route.parent
    });
  }

  ngOnInit() {
    this.centers = new Array();
    this.showProgress = true;
    this.centerManager.list().subscribe(
      data => {
        this.showProgress = false;
        this.centers = data.centers;
      },
      error => {
        this.showProgress = false;
        if (error === 500) {
          this.toastr.error(
            this.translate.instant('serverError'),
            this.translate.instant('error') + ' !'
          );
        }
      }
    );
    this.enterprises = new Array();
    this.showProgress = true;
    this.enterpriseManager.list().subscribe(
      data => {
        this.showProgress = false;
        this.enterprises = data.enterprises;
      },
      error => {
        this.showProgress = false;
        if (error === 500) {
          this.toastr.error(
            this.translate.instant('serverError'),
            this.translate.instant('error') + ' !'
          );
        }
      }
    );
  }
}
