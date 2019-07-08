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
import { CustomOffer } from 'src/app/classes/custom-offer';
import { OfferManagerService } from 'src/app/services/offerManager/offer-manager.service';
import * as jwt_decode from 'jwt-decode';
import { User } from 'src/app/classes/user/user';
import { ArrayType } from '@angular/compiler';
import { Interested } from 'src/app/classes/interested/interested';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  public serverBase: string;
  public offers: CustomOffer[];
  public showProgress: boolean;
  public user: User;
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
    private loginService: LoginService,
    private offersManager: OfferManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.showProgress = false;
    this.offers = new Array();
    this.user = new User();
    this.logoutS = new Logout(this.loginService, this.router);
  }

  ngOnInit() {
    this.loadOffers();
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

  addInterested(id: string) {
    this.showProgress = true;
    if (this.isUser) {
      this.offersManager.addIntersetd(id).subscribe(data => {
        this.showProgress = false;
        this.loadOffers();
      }, error => {
        this.showProgress = false;
        switch (error) {
          case 401:
            this.logoutS.do();
            break;
          case 400:
            this.toastr.error(this.translate.instant('detailsMissing'), this.translate.instant('error') + ' !');
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      });
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

  loadOffers() {
    this.showProgress = true;
    this.offersManager.list().subscribe(data => {
      this.showProgress = false;
      this.offers = data.offers;
      if (this.isUser()) {
        this.accountManager.getSubUser().subscribe(value => {
          this.user = value.user;
        }, error => {
          this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
        });
      }
    }, error => {
      this.showProgress = false;
      this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
    });
  }

  isIN(intersted: Interested[]): string {
    let isIn = 'KO';
    for (let i = 0; i < intersted.length; i++) {
      if (intersted[i].userId === this.user.id) {
        isIn = 'OK';
        break;
      }
    }
    return isIn;
  }

  switchJobOfferInfo(id) {
    if (this.isEnterprise()) {
      this.router.navigate(['jobofferinfo', id], { relativeTo: this.route.parent });
    }
  }

  logout() {
    this.logoutS.do();
  }

}
