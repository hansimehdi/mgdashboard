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
import { Center } from 'src/app/classes/center/center';
import { Enterprise } from 'src/app/classes/enterprise/enterprise';
import { CenterAccount } from 'src/app/classes/center/center-account';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
  public lang: string;
  public serverBase: string;
  public projectName: string;
  public loginBool: boolean;
  public logoutS: Logout;

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
    private loginService: LoginService
  ) {
    this.lang = this.languageSwitcher.getLang();
    this.translate.setDefaultLang(this.lang);
    this.projectName = this.gs.getProjectName();
    this.loginBool = this.loginService.isLoggedIn();
    this.logoutS = new Logout(this.loginService, this.router);
  }

  ngOnInit() {
    this.switchHome();
  }

  changeLang(lang: string) {
    this.lang = lang;
    this.translate.use(lang);
    this.languageSwitcher.changeLang(lang);
  }

  switchLogin() {
    this.router.navigate(['login']);
  }

  switchEnterpriseList() {
    this.router.navigate(['enterpriselist'], { relativeTo: this.route });
  }

  switchRegisterEnterprise() {
    this.router.navigate(['enterpriseregister'], { relativeTo: this.route });
  }

  switchRegisterCenter() {
    this.router.navigate(['centeregister'], { relativeTo: this.route });
  }

  switchRegisterUser() {
    this.router.navigate(['useregister'], { relativeTo: this.route });
  }

  switchAddSpecification() {
    if (this.isEnterprise()) {
      this.router.navigate(['addspecification'], { relativeTo: this.route });
    }
  }

  switchDashboard() {
    if (this.getDecodedAccessToken(this.loginService.getToken())) {
      if (
        this.getDecodedAccessToken(this.loginService.getToken()).info.role !==
          null &&
        this.getDecodedAccessToken(this.loginService.getToken()).info.role !==
          ''
      ) {
        if (
          this.getDecodedAccessToken(this.loginService.getToken()).info.role ===
          'sa'
        ) {
          this.router.navigate(['admindashboard']);
        }
      }
    }
  }

  switchHome() {
    this.router.navigate(['public/home']);
  }

  switchListSpecifications() {
    if (this.loginBool) {
      if (this.isCenter() || this.isEnterprise()) {
        this.router.navigate(['listspecifications'], {
          relativeTo: this.route
        });
      }
    }
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  getRole() {
    if (this.getDecodedAccessToken(this.loginService.getToken())) {
      if (
        this.getDecodedAccessToken(this.loginService.getToken()).info.role !==
          null &&
        this.getDecodedAccessToken(this.loginService.getToken()).info.role !==
          ''
      ) {
        return this.getDecodedAccessToken(this.loginService.getToken()).info
          .role;
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

  isSuerAdmin() {
    return this.getRole() === 'sa';
  }

  switchCenterList() {
    this.router.navigate(['centerlist'], { relativeTo: this.route });
  }

  switchOfferList() {
    this.router.navigate(['offerslist'], { relativeTo: this.route });
  }

  switchJobApplicantList() {
    this.router.navigate(['jobapplicantlist'], { relativeTo: this.route });
  }

  logout() {
    this.logoutS.do();
  }

  switchSettings() {
    if (this.loginBool && this.getRole() === 'U') {
      this.router.navigate(['usersettings'], { relativeTo: this.route });
    } else if (this.loginBool && this.getRole() === 'E') {
      this.router.navigate(['enterprisesettings'], { relativeTo: this.route });
    }
  }

  switchAddOffer() {
    if (this.loginBool && this.getRole() === 'E') {
      this.router.navigate(['addoffer'], { relativeTo: this.route });
    }
  }
}
