import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AdminpccService } from '../../services/adminParentChildConnector/adminpcc.service';
import { AccountManagerService } from '../../services/accountManager/account-manager.service';
import { LoginService } from '../../services/login/login.service';
import { GlobalService } from '../../services/globalConf/global.service';
import { LanguageService } from '../../services/language/language.service';
import { Logout } from '../../classes/logout/logout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnterpriseAccount } from 'src/app/classes/enterprise/enterprise-account';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css']
})
export class EnterpriseListComponent implements OnInit {
  public serverBase: string;
  public enterpriseNumber: number;
  public enterprises: EnterpriseAccount[];
  public showProgress: boolean;
  public searchId: string;
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
    private enterpriseManager: EnterpriseManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.enterpriseNumber = -1;
    this.searchId = '';
    this.enterprises = new Array();
  }

  ngOnInit() {
    this.showProgress = true;
    this.load();
  }

  searchFire(event) {
    if (this.searchId.length === 0) {
      this.load();
    } else {
      this.search();
    }
  }

  search() {
    this.showProgress = true;
    this.enterpriseManager.search(this.searchId).subscribe(
      data => {
        this.showProgress = false;
        this.enterprises = data.enterprises;
      },
      error => {
        this.showProgress = false;
        this.toastr.error(
          this.translate.instant('serverError'),
          this.translate.instant('error') + ' !'
        );
      }
    );
  }

  load() {
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
