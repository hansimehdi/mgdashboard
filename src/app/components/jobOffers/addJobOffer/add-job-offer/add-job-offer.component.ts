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
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Offer } from 'src/app/classes/offer';
import { OfferManagerService } from 'src/app/services/offerManager/offer-manager.service';

@Component({
  selector: 'app-add-job-offer',
  templateUrl: './add-job-offer.component.html',
  styleUrls: ['./add-job-offer.component.css']
})
export class AddJobOfferComponent implements OnInit {
  public showProgress: boolean;
  public offer: Offer;
  public logoutS: Logout;
  public offerForm: FormGroup;
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
    private offerManager: OfferManagerService
  ) {
    this.showProgress = false;
    this.offer = new Offer();
    this.logoutS = new Logout(this.loginService, this.router);
    this.offerForm = new FormGroup({
      'description': new FormControl('', Validators.required)
    });
    this.offerForm.valueChanges.subscribe(data => {
      if (data && data !== '') {
        this.offer.description = data.description;
      }
    });
  }

  ngOnInit() {
  }

  addOffer() {
    if (this.offerForm.valid) {
      this.showProgress = true;
      this.offerManager.add(this.offer).subscribe(data => {
        this.showProgress = false;
        if (data.message === 'OK') {
          this.router.navigate(['offerslist'], { relativeTo: this.route.parent });
        } else {
          this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
        }
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

  logout() {
    this.logoutS.do();
  }
}
