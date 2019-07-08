import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MailService } from '../../../../services/mail/mail.service';
import { Logout } from '../../../../classes/logout/logout';
import { LoginService } from '../../../../services/login/login.service';
import { MailServer } from '../../../../classes/mail/mail-server';
import { SlideInOutAnimation } from '../../../../classes/animation/fadeInOut/fade-in-out';

@Component({
  selector: 'app-emission',
  templateUrl: './emission.component.html',
  styleUrls: ['./emission.component.css'],
  animations: [SlideInOutAnimation]
})
export class EmissionComponent implements OnInit {
  public animationState: string;
  public animationStateReverse: string;
  public showProgress: boolean;
  public emissionForm: FormGroup;
  public emissionConf: MailServer;
  public tempEmissionConf: MailServer;
  public passwordLength: Array<number>;
  public showUpdateButton: boolean;
  public portPattern: string;
  public emailPattern: string;
  public urlPattern: string;
  public testStatus: boolean;
  public pageLoading: boolean;
  public logoutS: Logout;
  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public mailer: MailService,
    private location: Location,
    private loginService: LoginService
  ) {
    this.portPattern = '^[0-9]+$';
    this.emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    this.animationState = 'in';
    this.animationStateReverse = 'out';
    this.showUpdateButton = true;
    this.emissionConf = new MailServer();
    this.tempEmissionConf = new MailServer();
    this.testStatus = true;
    this.pageLoading = true;
    this.logoutS = new Logout(this.loginService, this.router);
    this.mailer.getEmission().subscribe(
      data => {
        this.emissionConf = data.emission;
        this.passwordLength = Array(this.emissionConf.password.length);
        this.pageLoading = false;
      },
      error => {
        this.pageLoading = false;
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
    this.emissionForm = new FormGroup({
      'host': new FormControl(this.emissionConf.host, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
      ])),
      'port': new FormControl(this.emissionConf.port, Validators.compose([
        Validators.required,
        Validators.pattern(this.portPattern),
        Validators.maxLength(5),
        Validators.minLength(2)
      ])),
      'email': new FormControl(this.emissionConf.email, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern)
      ])),
      'password': new FormControl('', Validators.required)
    });

    this.emissionForm.valueChanges.subscribe(
      data => {
        if (data.host != null) {
          this.tempEmissionConf.host = data.host;
        }
        if (data.port != null) {
          this.tempEmissionConf.port = data.port;
        }
        if (data.email != null) {
          this.tempEmissionConf.email = data.email;
        }
        if (data.password != null) {
          this.tempEmissionConf.password = data.password;
        }
      }
    );
  }

  ngOnInit() {
  }

  toggleShowDiv() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    this.animationStateReverse = this.animationStateReverse === 'out' ? 'in' : 'out';
    this.showUpdateButton = !this.showUpdateButton;
  }

  updateEmission() {
    if (this.emissionForm.valid) {
      this.tempEmissionConf.id = this.emissionConf.id;
      this.tempEmissionConf.type = this.emissionConf.type;
      this.showProgress = true;
      this.testStatus = true;
      this.mailer.updateServer(this.tempEmissionConf).subscribe(
        data => {
          this.showProgress = false;
          switch (data.message) {
            case 'OK':
              this.toastr.success(this.translate.instant('emissionUpdateSuccess'), this.translate.instant('success') + ' !');
              this.toggleShowDiv();
              this.emissionConf = this.tempEmissionConf;
              break;
            case 'INVALID_CONF':
              this.testStatus = false;
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
      Object.keys(this.emissionForm.controls).forEach(field => { // {1}
        const control = this.emissionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.logoutS.do();
  }
}
