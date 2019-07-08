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
import { CustomOffer } from 'src/app/classes/custom-offer';
import { OfferManagerService } from 'src/app/services/offerManager/offer-manager.service';
import * as jwt_decode from 'jwt-decode';
import { User } from 'src/app/classes/user/user';
import { CostomSpecification } from 'src/app/classes/customSpecification/costom-specification';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';
@Component({
  selector: 'app-list-specs',
  templateUrl: './list-specs.component.html',
  styleUrls: ['./list-specs.component.css']
})
export class ListSpecsComponent implements OnInit {
  public serverBase: string;
  public showProgress: boolean;
  public logoutS: Logout;
  public specifications: CostomSpecification[];
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
    this.showProgress = false;
    this.logoutS = new Logout(this.loginService, this.router);
    this.specifications = new Array();
  }

  ngOnInit() {
    this.showProgress = true;
    this.enterpriseManager.listSpecifications().subscribe(data => {
      this.showProgress = false;
      this.specifications = data.specifications;
    }, error => {
      this.showProgress = false;
      switch (error) {
        case 401:
          this.logoutS.do();
          break;
        default:
          this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
          break;
      }
    });
  }

  getRole() {
    if (this.getDecodedAccessToken(this.loginService.getToken())) {
      if (this.getDecodedAccessToken(this.loginService.getToken()).info.role !== null &&
        this.getDecodedAccessToken(this.loginService.getToken()).info.role !== '') {
        return this.getDecodedAccessToken(this.loginService.getToken()).info.role;
      }
    }
  }

  isEnterprise() {
    return this.getRole() === 'E';
  }

  isCenter() {
    return this.getRole() === 'C';
  }

  isUser() {
    return this.getRole() === 'U';
  }
  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  accountId() {
    if (this.getDecodedAccessToken(this.loginService.getToken())) {
      if (this.getDecodedAccessToken(this.loginService.getToken()).info.id !== null &&
        this.getDecodedAccessToken(this.loginService.getToken()).info.id !== '') {
        return this.getDecodedAccessToken(this.loginService.getToken()).info.id;
      }
    }
  }

  view(id) {
    this.router.navigate(['specificationinfo/', id], { relativeTo: this.route.parent });
  }
}
