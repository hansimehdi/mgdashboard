import { Component, OnInit, Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../../../classes/dateformatter/ngb-date-frparser-formatter';
import { AccountManagerService } from '../../../services/accountManager/account-manager.service';
import { LanguageService } from '../../../services/language/language.service';
import { LoginService } from '../../../services/login/login.service';
import { AccountC } from '../../../classes/account/account-c';
import { Logout } from '../../../classes/logout/logout';

import * as moment from 'moment';

export interface Role {
  value: string;
  viewValue: string;
}

const I18N_VALUES = {
  'en': {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  constructor(
    private translate: TranslateService,
    private langugeSwitcher: LanguageService
  ) {

  }
  language = this.langugeSwitcher.getLang();
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(
    private _i18n: I18n
  ) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

export function passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value !== undefined && (isNaN(control.value))) {
    if (control.parent.get('password').value !== control.value) {
      return { 'mismatch': true };
    }
  }
  return null;
}

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class NewAccountComponent implements OnInit {
  public showProgress: boolean;
  public newAccount: AccountC;
  public newAccountForm: FormGroup;
  public selectedValue: string;
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public phonePattern = '^[0-9]+$';

  public success: boolean;
  public logoutS: Logout;

  roles: Role[];
  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private accountManager: AccountManagerService,
    public dateConfig: NgbDatepickerConfig,
    private loginService: LoginService
  ) {
    this.success = false;
    this.showProgress = false;
    this.newAccount = new AccountC();
    this.logoutS = new Logout(this.loginService, this.router);

    this.dateConfig.minDate = {
      year: parseInt(moment(new Date()).format('YYYY'), 10),
      month: parseInt(moment(new Date()).add(1, 'months').format('MM'), 10),
      day: parseInt(moment(new Date()).format('DD'), 10)
    };
    this.roles = [
      { value: 'a', viewValue: 'admin' },
      { value: 'u', viewValue: 'user' }
    ];
    this.newAccountForm = new FormGroup({
      'firstname': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ])),
      'username': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ])),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern)
      ])),
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(11),
        Validators.pattern(this.phonePattern)
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      'passwordConf': new FormControl('', [Validators.required, passwordMatch]),
      'role': new FormControl('', Validators.required),
      'expireDate': new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.newAccountForm.valueChanges.subscribe(
      data => {
        if (data.firstname != null) {
          this.newAccount.firstname = data.firstname;
        }
        if (data.username != null) {
          this.newAccount.username = data.username;
        }
        if (data.email != null) {
          this.newAccount.email = data.email;
        }
        if (data.phone != null) {
          this.newAccount.phone = data.phone;
        }
        if (data.password != null) {
          this.newAccount.password = data.password;
        }
        if (data.passwordConf != null) {
          this.newAccount.passwordConf = data.passwordConf;
        }
        if (data.role != null) {
          this.newAccount.role = data.role;
        }
        if (data.expireDate != null) {
          this.newAccount.expireDate = moment(new Date(data.expireDate.year + '-' +
            data.expireDate.month + '-' + data.expireDate.day + ' 00:00:00')).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    );
  }

  ngOnInit() {

  }

  addAccount() {
    if (this.newAccountForm.valid) {
      this.showProgress = true;
      this.accountManager.registerAccount(this.newAccount).subscribe(
        data => {
          this.showProgress = false;
          switch (data.message) {
            case 'OK':
              this.toastr.success(this.translate.instant('AccountAddSuccess'), this.translate.instant('success') + ' !');
              this.router.navigate(['accountsList'], { relativeTo: this.route.parent });
              break;
            case 'PASSWORD_MISMATCH':
              this.toastr.info(this.translate.instant('passwordMismatch'), this.translate.instant('error') + ' !');
              break;
            case 'INVALID_DATE':
              this.toastr.info(this.translate.instant('invalidDate'), this.translate.instant('error') + ' !');
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
          }
        },
        error => {
          this.showProgress = false;
          switch (error) {
            case 401:
              this.logoutS.do();
              break;
            case 409:
              this.toastr.error(this.translate.instant('AccountExist'), this.translate.instant('error') + ' !');
              break;
            case 400:
              this.toastr.error(this.translate.instant('InvalidData'), this.translate.instant('error') + ' !');
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
          }
        }
      );
    } else {
      Object.keys(this.newAccountForm.controls).forEach(field => { // {1}
        const control = this.newAccountForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  resetNewAccount() {
    this.newAccountForm.reset();
  }

  logout() {
    this.logoutS.do();
  }
}
