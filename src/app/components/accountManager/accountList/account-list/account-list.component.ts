import { Component, OnInit, EventEmitter, Output, Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../../../../classes/dateformatter/ngb-date-frparser-formatter';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../../services/login/login.service';
import { LanguageService } from '../../../../services/language/language.service';
import { AccountManagerService } from '../../../../services/accountManager/account-manager.service';
import { GlobalService } from '../../../../services/globalConf/global.service';
import { Account } from '../../../../interfaces/account/account';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Logout } from '../../../../classes/logout/logout';
import * as jwt_decode from 'jwt-decode';


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
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  public showProgress: boolean;
  public lang: string;
  public start: number;
  public perPage: number;
  public accounts: Account[];
  public accountNumber: number;
  public isLoading: boolean;
  public permitLoading: boolean;
  public pageLoading: boolean;
  public selectAccount: string;
  public blockExpireDate: string;
  public expireDate: string;
  public logoutS: Logout;
  public serverBase: string;

  @Output() showInfo = new EventEmitter();

  public blockExpireForm: FormGroup;
  public expireForm: FormGroup;

  private _COLOR: Array<string> = ['#8e24aa', '#f50057', '#283593', '#e64a19', '#0d47a1', '#e53935'];
  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private languageSwitcher: LanguageService,
    private translate: TranslateService,
    private accountManager: AccountManagerService,
    public modalService: NgxSmartModalService,
    public dateConfig: NgbDatepickerConfig,
    private gs: GlobalService
  ) {
    this.pageLoading = true;
    this.showProgress = false;
    this.lang = '';
    this.start = 0;
    this.perPage = 10;
    this.accountNumber = 0;
    this.isLoading = false;
    this.permitLoading = true;
    this.blockExpireDate = '';
    this.serverBase = this.gs.getUrl();
    this.logoutS = new Logout(this.loginService, this.router);
    this.dateConfig.minDate = {
      year: parseInt(moment(new Date()).format('YYYY'), 10),
      month: parseInt(moment(new Date()).format('MM'), 10),
      day: parseInt(moment(new Date()).add(1, 'days').format('DD'), 10)
    };

    this.blockExpireForm = new FormGroup({
      'blockExpire': new FormControl('', Validators.required)
    }
    );

    this.blockExpireForm.valueChanges.subscribe(
      data => {
        if (data.blockExpire != null) {
          this.blockExpireDate = moment(new Date(data.blockExpire.year + '-' +
            data.blockExpire.month + '-' + data.blockExpire.day + ' 00:00:00')).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    );

    this.expireForm = new FormGroup({
      'expire': new FormControl('', Validators.required)
    });

    this.expireForm.valueChanges.subscribe(
      data => {
        if (data.expire != null) {
          this.expireDate = moment(new Date(data.expire.year + '-' +
            data.expire.month + '-' + data.expire.day + ' 00:00:00')).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    );
  }

  getRole() {
    if (this.getDecodedAccessToken(this.loginService.getToken())) {
      if (this.getDecodedAccessToken(this.loginService.getToken()).info.role !== null &&
        this.getDecodedAccessToken(this.loginService.getToken()).info.role !== '') {
        return this.getDecodedAccessToken(this.loginService.getToken()).info.role;
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
  
  ngOnInit() {
    this.lang = this.languageSwitcher.getLang();
    this.translate.setDefaultLang(this.lang);
    this.showProgress = true;
    this.accountManager.listAccount(this.start, this.perPage).subscribe(
      data => {
        this.accountNumber = data.count;
        if (data.count <= this.perPage) {
          this.permitLoading = false;
        }
        this.accounts = data.accounts;
        this.showProgress = false;
        this.pageLoading = false;
      },
      error => {
        this.showProgress = false;
        this.pageLoading = false;
        switch (error) {
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      }
    );
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _randomColor() {
    return this._COLOR[this.getRandomIntInclusive(0, 5)];
  }

  accountInfo(id) {
    this.router.navigate(['accountinfo/', id], { relativeTo: this.route.parent });
  }

  loadMoreAccounts() {
    this.isLoading = true;
    this.start = this.start + 10;
    this.accountManager.listAccount(this.start, this.perPage).subscribe(
      data => {
        for (let i = 0; i < data.accounts.length; i++) {
          this.accounts.push(data.accounts[i]);
        }
        this.accountNumber = data.count;
        if (data.count <= this.start) {
          this.permitLoading = false;
        } else {
          this.permitLoading = true;
        }
        this.isLoading = false;
      },
      error => {
        switch (error) {
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
        this.isLoading = false;
      }
    );
  }

  checkDelete(id) {
    this.selectAccount = id;
    this.modalService.getModal('deleteAccountModal').open();
  }

  confirmDelete() {
    this.modalService.getModal('deleteAccountModal').close();
    this.showProgress = true;
    this.accountManager.deleteAccount(this.selectAccount).subscribe(
      data => {
        switch (data.message) {
          case 'OK':
            for (let i = 0; i < this.accounts.length; i++) {
              if (this.accounts[i].id === this.selectAccount) {
                this.accounts.splice(i, 1);
              }
            }
            this.showProgress = false;
            this.toastr.success(this.translate.instant('accountDeleteSuccess'), this.translate.instant('success') + ' !');
            break;
          default:
            this.showProgress = false;
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      },
      error => {
        switch (error) {
          case 400:
            this.toastr.error(this.translate.instant('notPermitted'), this.translate.instant('error') + ' !');
            break;
          case 404:
            this.toastr.error(this.translate.instant('accountNotFound'), this.translate.instant('error') + ' !');
            break;
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      }
    );
  }

  pickBlockDate(id) {
    this.selectAccount = id;
    this.blockExpireForm.reset();
    this.modalService.getModal('BlockAccountModal').open();
  }

  confirmBlock() {
    if (this.blockExpireForm.valid) {
      this.modalService.getModal('BlockAccountModal').close();
      this.showProgress = true;
      this.accountManager.blockAccount(this.selectAccount, this.blockExpireDate).subscribe(
        data => {
          this.showProgress = false;
          switch (data.message) {
            case 'OK':
              for (let i = 0; i < this.accounts.length; i++) {
                if (this.accounts[i].id === this.selectAccount) {
                  this.accounts[i].blockStatus = '1';
                }
              }
              this.toastr.success(this.translate.instant('accountBlockedSuccess'), this.translate.instant('success') + ' !');
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
            case 301:
              this.toastr.error(this.translate.instant('notPermitted'), this.translate.instant('error') + ' !');
              break;
            case 400:
              this.toastr.error(this.translate.instant('requiredFieldError'), this.translate.instant('error') + ' !');
              break;
            case 401:
              this.logout();
              break;
            case 404:
              this.toastr.error(this.translate.instant('accountNotFound'), this.translate.instant('error') + ' !');
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
          }
        }
      );
    }
  }

  pickUnlockDate(id) {
    this.selectAccount = id;
    this.expireForm.reset();
    this.modalService.getModal('UnlockAccountModal').open();
  }

  confirmUnlock() {
    if (this.expireForm.valid) {
      this.modalService.getModal('UnlockAccountModal').close();
      this.showProgress = true;
      this.accountManager.unlockAccount(this.selectAccount, this.expireDate).subscribe(
        data => {
          this.showProgress = false;
          switch (data.message) {
            case 'OK':
              for (let i = 0; i < this.accounts.length; i++) {
                if (this.accounts[i].id === this.selectAccount) {
                  this.accounts[i].blockStatus = '0';
                }
              }
              this.toastr.success(this.translate.instant('accountUnlockedSuccess'), this.translate.instant('success') + ' !');
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
            case 301:
              this.toastr.error(this.translate.instant('notPermitted'), this.translate.instant('error') + ' !');
              break;
            case 400:
              this.toastr.error(this.translate.instant('requiredFieldError'), this.translate.instant('error') + ' !');
              break;
            case 401:
              this.logout();
              break;
            case 404:
              this.toastr.error(this.translate.instant('accountNotFound'), this.translate.instant('error') + ' !');
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
          }
        }
      );
    }
  }

  logout() {
    this.logoutS.do();
  }
}
