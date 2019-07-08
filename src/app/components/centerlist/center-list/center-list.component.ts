import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AdminpccService } from '../../../services/adminParentChildConnector/adminpcc.service';
import { AccountManagerService } from '../../../services/accountManager/account-manager.service';
import { LoginService } from '../../../services/login/login.service';
import { GlobalService } from '../../../services/globalConf/global.service';
import { LanguageService } from '../../../services/language/language.service';
import { Logout } from '../../../classes/logout/logout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CenterManagerService } from 'src/app/services/center/center-manager.service';
import { CenterAccount } from 'src/app/classes/center/center-account';

@Component({
  selector: 'app-center-list',
  templateUrl: './center-list.component.html',
  styleUrls: ['./center-list.component.css']
})
export class CenterListComponent implements OnInit {
  public serverBase: string;
  public centers: CenterAccount[];
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
    private centerManager: CenterManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.searchId = '';
  }

  ngOnInit() {
    this.centers = new Array();
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
    this.centerManager.search(this.searchId).subscribe(
      data => {
        this.showProgress = false;
        this.centers = data.centers;
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
  }
}
