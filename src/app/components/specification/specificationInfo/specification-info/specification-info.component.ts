import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AdminpccService } from '../../../../services/adminParentChildConnector/adminpcc.service';
import { AccountManagerService } from '../../../../services/accountManager/account-manager.service';
import { LoginService } from '../../../../services/login/login.service';
import { GlobalService } from '../../../../services/globalConf/global.service';
import { LanguageService } from '../../../../services/language/language.service';
import { Logout } from '../../../../classes/logout/logout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomOffer } from 'src/app/classes/custom-offer';
import { OfferManagerService } from 'src/app/services/offerManager/offer-manager.service';
import * as jwt_decode from 'jwt-decode';
import { User } from 'src/app/classes/user/user';
import { CostomSpecification } from 'src/app/classes/customSpecification/costom-specification';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/classes/comment/comment';
import { Enterprise } from 'src/app/classes/enterprise/enterprise';
@Component({
  selector: 'app-specification-info',
  templateUrl: './specification-info.component.html',
  styleUrls: ['./specification-info.component.css']
})
export class SpecificationInfoComponent implements OnInit {
  public serverBase: string;
  public showProgress: boolean;
  public logoutS: Logout;
  public specification: CostomSpecification;
  public specId = this.route.snapshot.paramMap.get('id');
  public comment: Comment;
  public commentForm: FormGroup;
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
    private enterpriseManager: EnterpriseManagerService
  ) {
    this.serverBase = this.gs.getUrl();
    this.showProgress = false;
    this.logoutS = new Logout(this.loginService, this.router);
    this.specification = new CostomSpecification();
    this.comment = new Comment();
    this.enterprise = new Enterprise();

    this.commentForm = new FormGroup({
      'comment': new FormControl('', Validators.required)
    });

    this.commentForm.valueChanges.subscribe(v => {
      if (v.comment && v.comment !== '') {
        this.comment.comment = v.comment;
      }
    });
  }

  ngOnInit() {
    this.loadSpecs();
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

  isOwned() {
    if (this.isEnterprise()) {
      if (this.specification.enterpriseId === this.enterprise.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  loadSpecs() {
    this.showProgress = true;
    this.enterpriseManager.getSpecification(this.specId).subscribe(data => {
      this.showProgress = false;
      this.specification = data.specification;
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

  addComment() {
    if (this.isCenter() && this.commentForm.valid) {
      this.comment.specificationId = this.specId;
      this.enterpriseManager.commentSpecification(this.comment).subscribe(data => {
        this.loadSpecs();
        this.comment = new Comment();
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

  deleteSpec(id: string) {
    this.showProgress = true;
    this.enterpriseManager.deleteSpecification(id).subscribe(
      data => {
        this.showProgress = false;
        this.router.navigate(['listspecifications'], { relativeTo: this.route.parent });
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
    );
  }
}
