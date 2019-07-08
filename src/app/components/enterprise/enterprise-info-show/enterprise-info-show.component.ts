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
import { EnterpriseAccount } from 'src/app/classes/enterprise/enterprise-account';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';
@Component({
  selector: 'app-enterprise-info-show',
  templateUrl: './enterprise-info-show.component.html',
  styleUrls: ['./enterprise-info-show.component.css']
})
export class EnterpriseInfoShowComponent implements OnInit {
  public serverBase: string;
  public enterprise: EnterpriseAccount;
  public showProgress: boolean;
  public enterpriseId = this.route.snapshot.paramMap.get('id');
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
    this.showProgress = false;
    this.serverBase = this.gs.getUrl();
    this.enterprise = new EnterpriseAccount();
  }

  ngOnInit() {
    this.showProgress = true;
    this.enterpriseManager.get(this.enterpriseId).subscribe(
      data => {
        this.showProgress = false;
        this.enterprise = data.enterprise;
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
