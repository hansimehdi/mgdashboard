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
import { UserAccount } from 'src/app/classes/user/user-account';
import { JobApplicantManagerService } from 'src/app/services/jobApplicant/job-applicant-manager.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public serverBase: string;
  public showProgress: boolean;
  public users: UserAccount[];
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
    private jobApplicantService: JobApplicantManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.showProgress = false;
    this.searchId = '';
  }

  ngOnInit() {
    this.showProgress = true;
    this.users = new Array();
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
    this.jobApplicantService.search(this.searchId).subscribe(
      data => {
        this.showProgress = false;
        this.users = data.users;
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
    this.jobApplicantService.list().subscribe(
      data => {
        this.showProgress = false;
        this.users = data.users;
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
}
