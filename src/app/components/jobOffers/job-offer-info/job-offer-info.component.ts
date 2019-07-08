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
import { OfferManagerService } from 'src/app/services/offerManager/offer-manager.service';
import * as jwt_decode from 'jwt-decode';
import { User } from 'src/app/classes/user/user';
import { CostomSpecification } from 'src/app/classes/customSpecification/costom-specification';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/classes/comment/comment';
import { Enterprise } from 'src/app/classes/enterprise/enterprise';
import { CustomOfferInfo } from 'src/app/classes/custom-offer-info';
import { Interested } from 'src/app/classes/interested/interested';
@Component({
  selector: 'app-job-offer-info',
  templateUrl: './job-offer-info.component.html',
  styleUrls: ['./job-offer-info.component.css']
})
export class JobOfferInfoComponent implements OnInit {
  public serverBase: string;
  public showProgress: boolean;
  public logoutS: Logout;
  public offerId = this.route.snapshot.paramMap.get('id');
  public offer: CustomOfferInfo;
  public user: User;
  public enterprise: Enterprise;

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
    private offerManager: OfferManagerService,
    private enterpriseManager: EnterpriseManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.showProgress = false;
    this.logoutS = new Logout(this.loginService, this.router);
    this.offer = new CustomOfferInfo();
    this.user = new User();
    this.enterprise = new Enterprise();
  }

  ngOnInit() {
    this.loadOffer();
    if (this.isEnterprise()) {
      this.enterpriseManager.current().subscribe(data => {
        this.enterprise = data.enterprise;
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

  loadOffer() {
    this.showProgress = true;
    this.offerManager.offerInfo(this.offerId).subscribe(data => {
      this.showProgress = false;
      this.offer = data.offer;
      if (this.isUser()) {
        this.accountManager.getSubUser().subscribe(value => {
          this.user = value.user;
        }, error => {
          this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
        });
      }
    }, error => {
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

  addInterested(id: string) {
    this.showProgress = true;
    if (this.isUser) {
      this.offerManager.addIntersetd(id).subscribe(data => {
        this.showProgress = false;
        this.loadOffer();
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

  isOwned() {
    if (this.isEnterprise()) {
      if (this.offer.enterpriseId === this.enterprise.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  deleteOffer(id) {
    if (this.isEnterprise()) {
      this.showProgress = true;
      this.offerManager.deleteOffer(id).subscribe(
        data => {
          this.showProgress = false;
          this.router.navigate(['offerslist'], { relativeTo: this.route.parent });
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
        }
      )
    }
  }
}
