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
import { EnterpriseAccount } from 'src/app/classes/enterprise/enterprise-account';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

export function passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value !== undefined && (isNaN(control.value))) {
    if (control.parent.get('password').value !== control.value) {
      return { 'mismatch': true };
    }
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  private enterpriseAccount: EnterpriseAccount;
  private registrationForm: FormGroup;
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public showProgress: boolean;


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
    private enterprsieService: EnterpriseManagerService
  ) {
    this.enterpriseAccount = new EnterpriseAccount();
    this.enterpriseAccount.role = 'E';
    this.enterpriseAccount.expireDate = '';
    this.enterpriseAccount.enterprise.id = '';
    this.enterpriseAccount.enterprise.accId = '';
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['home'], { relativeTo: this.route.parent });
    }
  }
  ngOnInit() {
    this.registrationForm = new FormGroup({
      'firstname': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ])),
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(11)
      ])),
      'trn': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12)
      ])),
      'empNum': new FormControl(''),
      'capital': new FormControl(''),
      'domain': new FormControl(''),
      'address': new FormControl(''),
      'password': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      'passwordConf': new FormControl('', [Validators.required, passwordMatch])
    });

    this.registrationForm.valueChanges.subscribe(
      data => {
        if (data.firstname !== null && data.firstname !== '') {
          this.enterpriseAccount.firstname = data.firstname;
          this.enterpriseAccount.username = data.firstname;
        }

        if (data.email !== null && data.email !== '') {
          this.enterpriseAccount.email = data.email;
        }

        if (data.password !== null && data.password !== '') {
          this.enterpriseAccount.password = data.password;
        }

        if (data.passwordConf !== null && data.passwordConf !== '') {
          this.enterpriseAccount.passwordConf = data.passwordConf;
        }

        if (data.passwordConf !== null && data.passwordConf !== '') {
          this.enterpriseAccount.passwordConf = data.passwordConf;
        }

        if (data.phone !== null && data.phone !== '') {
          this.enterpriseAccount.phone = data.phone;
        }

        if (data.trn !== null && data.trn !== '') {
          this.enterpriseAccount.enterprise.trn = data.trn;
        }

        if (data.empNum !== null && data.empNum !== '') {
          this.enterpriseAccount.enterprise.empNum = data.empNum;
        }

        if (data.capital !== null && data.capital !== '') {
          this.enterpriseAccount.enterprise.capital = data.capital;
        }

        if (data.domain !== null && data.domain !== '') {
          this.enterpriseAccount.enterprise.domain = data.domain;
        }

        if (data.address !== null && data.address !== '') {
          this.enterpriseAccount.enterprise.address = data.address;
        }

      }
    );
  }

  addAccount() {
    this.showProgress = true;
    if (this.registrationForm.valid) {
      this.enterprsieService.register(this.enterpriseAccount).subscribe(
        data => {
          this.showProgress = false;
          this.toastr.success(this.translate.instant('AccountAddSuccess'), this.translate.instant('success') + ' !');
          this.showProgress = false;
          this.router.navigate(['home'], { relativeTo: this.route.parent });
        },
        error => {
          this.showProgress = false;
          switch (error) {
            case 302:
              this.router.navigate(['home'], { relativeTo: this.route.parent });
              break;
            case 400:
              this.toastr.error(this.translate.instant('AccountExist'), this.translate.instant('error') + ' !');
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
          }
        }
      );
    }
  }

}
