import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


import { Login } from '../../interfaces/login/login';

import { LoginService } from '../../services/login/login.service';
import { LanguageService } from '../../services/language/language.service';
import { RecoveryService } from '../../services/recovery/recovery.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public login: Login;
  public lang: string;
  public showError: boolean;
  public errorLogin: string;
  public showAttmpts: boolean;
  public attempts: string;
  public showProgress: boolean;

  constructor(
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private languageSwitcher: LanguageService,
    private translate: TranslateService,
    private recovery: RecoveryService
  ) {
    this.login = new Login('', '');
    this.lang = this.languageSwitcher.getLang();
    this.translate.setDefaultLang(this.lang);
    this.errorLogin = '';
    this.showError = false;
    this.showAttmpts = false;
    this.showProgress = false;
    this.attempts = '';
  }

  ngOnInit() {
  }
  loginUser() {
    this.showProgress = true;
    this.loginService.doLogin(this.login).subscribe(
      data => {
        this.showProgress = false;
        switch (data.message) {
          case 'INVALID_DATA':
            this.showError = true;
            this.showAttmpts = false;
            this.errorLogin = 'requiredFieldError';
            break;
          case 'ACCOUNT_NOT_FOUND':
            this.showError = true;
            this.showAttmpts = false;
            this.errorLogin = 'accountNotFound';
            break;
          case 'ACCOUNT_BLOCKED':
            this.showError = true;
            this.showAttmpts = false;
            this.errorLogin = 'accountBlocked';
            break;
          case 'INVALID_PASSWORD':
            this.showError = true;
            this.errorLogin = 'invalidPassword';
            this.attempts = data.attempts;
            this.showAttmpts = true;
            break;
          case 'OK':
            localStorage.setItem('token', data.token);
            if (data.connected.info.role === 'sa') {
              this.router.navigate(['admindashboard']);
            } else {
              this.router.navigate(['public']);
            }
            this.login.username = '';
            this.login.password = '';
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), ' Error !');
            break;
        }
      },
      error => {
        this.showProgress = false;
        this.showAttmpts = false;
        this.showError = false;
        this.toastr.error(error.status, ' Error !');
      }
    );
  }

  forgotPassword() {
    this.recovery.setRecovery();
    this.router.navigate(['/']);

  }
  changeLang(lang: string) {
    this.lang = lang;
    this.translate.use(lang);
    this.languageSwitcher.changeLang(lang);
  }

}
