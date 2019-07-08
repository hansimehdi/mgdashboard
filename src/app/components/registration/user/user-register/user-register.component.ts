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
import { AccountC } from 'src/app/classes/account/account-c';
export function passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value !== undefined && (isNaN(control.value))) {
    if (control.parent.get('password').value !== control.value) {
      return { 'mismatch': true };
    }
  }
  return null;
}
@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  private userAccount: AccountC;
  private registrationForm: FormGroup;
  public showProgress: boolean;
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
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
    private userService: AccountManagerService
  ) {
    this.userAccount = new AccountC();
    this.userAccount.role = 'U';
    this.userAccount.expireDate = '';
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['home'], { relativeTo: this.route.parent });
    }
  }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      'username': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ])),
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
      'password': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      'passwordConf': new FormControl('', [Validators.required, passwordMatch])
    });

    this.registrationForm.valueChanges.subscribe(
      data => {
        if (data.username !== null && data.username !== '') {
          this.userAccount.username = data.username;
        }

        if (data.firstname !== null && data.firstname !== '') {
          this.userAccount.firstname = data.firstname;
        }

        if (data.email !== null && data.email !== '') {
          this.userAccount.email = data.email;
        }

        if (data.password !== null && data.password !== '') {
          this.userAccount.password = data.password;
        }

        if (data.passwordConf !== null && data.passwordConf !== '') {
          this.userAccount.passwordConf = data.passwordConf;
        }

        if (data.passwordConf !== null && data.passwordConf !== '') {
          this.userAccount.passwordConf = data.passwordConf;
        }

        if (data.phone !== null && data.phone !== '') {
          this.userAccount.phone = data.phone;
        }
      }
    );
  }

  addAccount() {
    if (this.registrationForm.valid) {
      this.showProgress = true;
      this.userService.addSimpleAccount(this.userAccount).subscribe(
        data => {
          this.toastr.success(this.translate.instant('AccountAddSuccess'), this.translate.instant('success') + ' !');
          this.showProgress = false;
          this.router.navigate(['home'], { relativeTo: this.route.parent });
        }, error => {
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
