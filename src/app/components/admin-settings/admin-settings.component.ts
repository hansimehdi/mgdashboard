import { Component, OnInit, EventEmitter, Output, Injectable, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../../classes/dateformatter/ngb-date-frparser-formatter';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../services/login/login.service';
import { LanguageService } from '../../services/language/language.service';
import { AccountManagerService } from '../../services/accountManager/account-manager.service';
import { GlobalService } from '../../services/globalConf/global.service';
import { Accountwithpp } from '../../interfaces/accountwithpp/accountwithpp';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Logout } from '../../classes/logout/logout';
import { Passwordupdate } from '../../interfaces/passwordupdate/passwordupdate';
import { AdminpccService } from '../../services/adminParentChildConnector/adminpcc.service';


export class FullName {
  public username: string;
  public firstname: string;
  public password: string;
}

export class EmailSetting {
  public email: string;
  public password: string;
}

export class PhoneSetting {
  public phone: string;
  public password: string;
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
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  public showProgress: boolean;
  public showUploadProgress: boolean;
  public lang: string;
  public account: Accountwithpp;
  public pageLoading: boolean;
  public errorTimeOut: boolean;
  public hovering: boolean;
  public logoutS: Logout;
  public imageSrc: string;
  public fullNameForm: FormGroup;
  public EmailForm: FormGroup;
  public phoneForm: FormGroup;
  public passwordForm: FormGroup;
  public fullName: FullName;
  public emailStting: EmailSetting;
  public phoneSetting: PhoneSetting;
  public passwordUpdate: Passwordupdate;
  private AllowedExt: string[];
  public validExt: boolean;
  public AllowedSize: number;
  public validSize: boolean;
  public serverBase: string;
  public isMobile: boolean;
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public phonePattern = '^[0-9]+$';
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
    public ref: ElementRef,
    public gs: GlobalService,
    public connector: AdminpccService
  ) {
    this.lang = '';
    this.showProgress = true;
    this.showUploadProgress = false;
    this.pageLoading = true;
    this.errorTimeOut = false;
    this.hovering = false;
    this.fullName = new FullName();
    this.emailStting = new EmailSetting();
    this.phoneSetting = new PhoneSetting();
    this.passwordUpdate = new Passwordupdate();
    this.logoutS = new Logout(this.loginService, this.router);

    this.AllowedExt = ['image/jpeg', 'image/jpg', 'image/png'];
    this.validExt = true;

    this.AllowedSize = 10;
    this.validSize = true;

    this.serverBase = this.gs.getUrl();

    this.getCurrent();
    this.fullNameForm = new FormGroup({
      'username': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ])),
      'firstname': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.fullNameForm.valueChanges.subscribe(
      data => {
        if (data && data.firstname !== '' && data.firstname !== null) {
          this.fullName.firstname = data.firstname;
        }
        if (data && data.username !== '' && data.username !== null) {
          this.fullName.username = data.username;
        }
        if (data && data.password !== '' && data.password !== null) {
          this.fullName.password = data.password;
        }
      }
    );

    this.EmailForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern)
      ])),
      'password': new FormControl('', Validators.required)
    });

    this.EmailForm.valueChanges.subscribe(
      data => {
        if (data && data.email !== '' && data.email !== null) {
          this.emailStting.email = data.email;
        }
        if (data && data.password !== '' && data.password !== null) {
          this.emailStting.password = data.password;
        }
      }
    );

    this.phoneForm = new FormGroup({
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(11),
        Validators.pattern(this.phonePattern)
      ])),
      'password': new FormControl('', Validators.required)
    });

    this.phoneForm.valueChanges.subscribe(
      data => {
        if (data && data.phone !== '' && data.phone !== null) {
          this.phoneSetting.phone = data.phone;
        }
        if (data && data.password !== '' && data.password !== null) {
          this.phoneSetting.password = data.password;
        }
      }
    );

    this.passwordForm = new FormGroup({
      'currentpassword': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      'passwordconf': new FormControl('', [Validators.required, passwordMatch])
    });

    this.passwordForm.valueChanges.subscribe(
      data => {
        if (data && data.currentpassword !== '' && data.currentpassword !== null) {
          this.passwordUpdate.currentpassword = data.currentpassword;
        }
        if (data && data.newpassword !== '' && data.newpassword !== null) {
          this.passwordUpdate.password = data.password;
        }
        if (data && data.passwordconf !== '' && data.passwordconf !== null) {
          this.passwordUpdate.passwordconf = data.passwordconf;
        }
      }
    );
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width:768px)'])
      .subscribe((state: BreakpointState) => {
        if (!state.matches) {
          this.isMobile = true;
        }
      });
  }

  logout() {
    this.logoutS.do();
  }

  toggleUpdatePhoto() {
    this.hovering = !this.hovering;
  }

  updateProfilePicture() {
    this.modalService.getModal('updatePhotoModal').open();
  }

  readURL(event) {
    if (event.target.files && event.target.files[0]) {
      this.checkExt(event.target.files[0].type);
      this.checkSize(event.target.files[0].size);
      if (this.validSize && this.validExt) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.imageSrc = reader.result.toString();
        };
      } else {
        this.imageSrc = '';
      }
    }
  }

  private checkExt(fileType: any) {
    if (this.AllowedExt.indexOf(fileType) === -1) {
      this.validExt = false;
    } else {
      this.validExt = true;
    }
  }

  private checkSize(fileSize: any) {
    const MBsize = parseInt(fileSize, 10) / 1024 / 1024;
    if (MBsize > this.AllowedSize) {
      this.validSize = false;
    } else {
      this.validSize = true;
    }
  }

  cancelUplaod() {
    this.modalService.getModal('updatePhotoModal').close();
    this.imageSrc = '';
    this.validExt = true;
    this.validSize = true;
  }

  uploadProfilePicture() {
    const files = this.ref.nativeElement.querySelector('#file').files;
    if (files && files[0]) {
      this.showUploadProgress = true;
      const formData: FormData = new FormData();
      formData.append('profilepicture', files[0], files[0].name);
      this.accountManager.changeProfilePictue(formData).subscribe(
        data => {
          this.showUploadProgress = false;
          switch (data.response) {
            case 'OK':
              this.askParent();
              this.getCurrent();
              this.toastr.success(this.translate.instant('profilePictureUpdateSuccess'), this.translate.instant('sucess') + ' !');
              this.cancelUplaod();
              break;
            case 'SERVER_UPLOAD_ERR':
              this.cancelUplaod();
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
            case 'SERVER_UPLOAD_DIR_ERR':
              this.cancelUplaod();
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
            case 'FILE_FORMAT_ERR':
              this.cancelUplaod();
              this.toastr.error(this.translate.instant('allowedFormat') + 'jpg,jpeg,png', this.translate.instant('error') + '!');
              break;
            case 'FILE_SIZE_ERR':
              this.cancelUplaod();
              this.toastr.error(this.translate.instant('maxImageSize') + this.AllowedSize + 'Mo', this.translate.instant('error') + ' !');
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              break;
          }
        },
        error => {
          this.showUploadProgress = false;
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
    }
  }

  getCurrent() {
    this.accountManager.getCurrent().subscribe(
      data => {
        this.pageLoading = false;
        this.showProgress = false;
        if (!data.current) {
          this.errorTimeOut = true;
        } else if (data.current.id.length !== '') {
          this.errorTimeOut = false;
          this.account = data.current;
        } else {
          this.errorTimeOut = true;
        }
      },
      error => {
        this.pageLoading = false;
        this.showProgress = false;
        switch (error) {
          case 401:
            this.logout();
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            this.errorTimeOut = true;
            break;
        }
      }
    );
  }

  openUpdateFullName() {
    this.fullNameForm.reset();
    this.modalService.getModal('FullNameUpdateModal').open();
  }

  proceedUpdateFullName() {
    if (this.fullNameForm.valid) {
      this.showProgress = true;
      this.accountManager.updateFullName(this.fullName).subscribe(
        data => {
          this.showProgress = false;
          if (data.message) {
            switch (data.message) {
              case 'OK':
                this.fullName = new FullName();
                this.askParent();
                this.getCurrent();
                this.cancelUpdateFullName();
                this.toastr.success(this.translate.instant('fullNameUpdateSuccess'), this.translate.instant('success') + ' !');
                break;
              case 'INVALID_DATA':
                this.getCurrent();
                this.cancelUpdateFullName();
                this.toastr.info(this.translate.instant('InvalidData'), this.translate.instant('error') + ' !');
                break;
              case 'INVALID_PASSWORD':
                this.getCurrent();
                this.cancelUpdateFullName();
                this.toastr.error(this.translate.instant('invalidPassword'), this.translate.instant('error') + ' !');
                break;
              case 'DATA_REJECTED':
                this.getCurrent();
                this.cancelUpdateFullName();
                this.toastr.error(this.translate.instant('dataRejected'), this.translate.instant('error') + ' !');
                break;
              default:
                this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
                break;
            }
          } else {
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            this.cancelUpdateFullName();
          }
        },
        error => {
          this.showProgress = false;
          switch (error) {
            case 401:
              this.logoutS.do();
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              this.cancelUpdateFullName();
              break;
          }
        }
      );
    } else {
      this.updateFormControls(this.fullNameForm, false);
    }
  }

  cancelUpdateFullName() {
    this.modalService.getModal('FullNameUpdateModal').close();
    this.fullNameForm.reset();
    this.updateFormControls(this.fullNameForm, true);
  }

  proceedUpdateEmail() {
    if (this.EmailForm.valid) {
      this.showProgress = true;
      this.accountManager.updateEmail(this.emailStting).subscribe(
        data => {
          this.showProgress = false;
          if (data.message) {
            switch (data.message) {
              case 'OK':
                this.emailStting = new EmailSetting();
                this.getCurrent();
                this.cancelUpdateEmail();
                this.toastr.success(this.translate.instant('emailUpdateSuccess'), this.translate.instant('success') + ' !');
                break;
              case 'INVALID_DATA':
                this.getCurrent();
                this.cancelUpdateEmail();
                this.toastr.info(this.translate.instant('InvalidData'), this.translate.instant('error') + ' !');
                break;
              case 'INVALID_PASSWORD':
                this.getCurrent();
                this.cancelUpdateEmail();
                this.toastr.error(this.translate.instant('invalidPassword'), this.translate.instant('error') + ' !');
                break;
              case 'DATA_REJECTED':
                this.getCurrent();
                this.cancelUpdateEmail();
                this.toastr.error(this.translate.instant('dataRejected'), this.translate.instant('error') + ' !');
                break;
              default:
                this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
                break;
            }
          } else {
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            this.cancelUpdateEmail();
          }
        },
        error => {
          this.showProgress = false;
          switch (error) {
            case 401:
              this.logoutS.do();
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              this.cancelUpdateEmail();
              break;
          }
        }
      );
    } else {
      this.updateFormControls(this.EmailForm, false);
    }
  }

  openUpdateEmail() {
    this.EmailForm.reset();
    this.modalService.getModal('EmailUpdateModal').open();
  }

  cancelUpdateEmail() {
    this.modalService.getModal('EmailUpdateModal').close();
    this.fullNameForm.reset();
    this.updateFormControls(this.EmailForm, true);
  }

  proceedUpdatePhone() {
    if (this.phoneForm.valid) {
      this.showProgress = true;
      this.accountManager.updatePhone(this.phoneSetting).subscribe(
        data => {
          this.showProgress = false;
          if (data.message) {
            switch (data.message) {
              case 'OK':
                this.phoneSetting = new PhoneSetting();
                this.getCurrent();
                this.cancelUpdatePhone();
                this.toastr.success(this.translate.instant('phoneUpdateSuccess'), this.translate.instant('success') + ' !');
                break;
              case 'INVALID_DATA':
                this.getCurrent();
                this.cancelUpdatePhone();
                this.toastr.info(this.translate.instant('InvalidData'), this.translate.instant('error') + ' !');
                break;
              case 'INVALID_PASSWORD':
                this.getCurrent();
                this.cancelUpdatePhone();
                this.toastr.error(this.translate.instant('invalidPassword'), this.translate.instant('error') + ' !');
                break;
              case 'DATA_REJECTED':
                this.getCurrent();
                this.cancelUpdatePhone();
                this.toastr.error(this.translate.instant('dataRejected'), this.translate.instant('error') + ' !');
                break;
              default:
                this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
                break;
            }
          } else {
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            this.cancelUpdatePhone();
          }
        },
        error => {
          this.showProgress = false;
          switch (error) {
            case 401:
              this.logoutS.do();
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              this.cancelUpdatePhone();
              break;
          }
        }
      );
    } else {
      this.updateFormControls(this.phoneForm, false);
    }
  }

  cancelUpdatePhone() {
    this.modalService.getModal('PhoneUpdateModal').close();
    this.phoneForm.reset();
    this.updateFormControls(this.phoneForm, true);
  }
  openUpdatePhone() {
    this.phoneForm.reset();
    this.modalService.getModal('PhoneUpdateModal').open();
  }

  proceedUpdatePassword() {
    if (this.passwordForm.valid) {
      this.showProgress = true;
      this.accountManager.updatePassword(this.passwordUpdate).subscribe(
        data => {
          this.showProgress = false;
          if (data.message) {
            switch (data.message) {
              case 'OK':
                this.phoneSetting = new PhoneSetting();
                this.cancelUpdatePassword();
                this.toastr.success(this.translate.instant('passwordUpdateSuccess'), this.translate.instant('success') + ' !');
                break;
              case 'INVALID_DATA':
                this.cancelUpdatePassword();
                this.toastr.info(this.translate.instant('InvalidData'), this.translate.instant('error') + ' !');
                break;
              case 'INVALID_PASSWORD':
                this.cancelUpdatePassword();
                this.toastr.error(this.translate.instant('invalidPassword'), this.translate.instant('error') + ' !');
                break;
              case 'PASSWORD_MISMATCH':
                this.cancelUpdatePassword();
                this.toastr.error(this.translate.instant('passwordMismatch'), this.translate.instant('error') + ' !');
                break;
              default:
                this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
                break;
            }
          } else {
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            this.cancelUpdatePassword();
          }
        },
        error => {
          this.showProgress = false;
          switch (error) {
            case 401:
              this.logoutS.do();
              break;
            default:
              this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
              this.cancelUpdatePassword();
              break;
          }
        }
      );
    } else {
      this.updateFormControls(this.passwordForm, false);
    }
  }

  cancelUpdatePassword() {
    this.modalService.getModal('PasswordUpdateModal').close();
    this.passwordForm.reset();
    this.updateFormControls(this.passwordForm, true);
  }

  openUpdatePassword() {
    this.passwordForm.reset();
    this.modalService.getModal('PasswordUpdateModal').open();
  }
  updateFormControls(form: FormGroup, status: boolean) {
    if (!status) {
      Object.keys(form.controls).forEach(field => { // {1}
        const control = form.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    } else {
      Object.keys(form.controls).forEach(field => { // {1}
        const control = form.get(field);            // {2}
        control.markAsUntouched({ onlySelf: true });       // {3}
        control.markAsPristine({ onlySelf: true });       // {3}
        control.markAsTouched({ onlySelf: false });       // {3}
        control.markAsDirty({ onlySelf: false });       // {3}
      });
    }
  }

  askParent() {
    this.connector.changeMessage('SETTINGS_CHANGED');
  }
}
