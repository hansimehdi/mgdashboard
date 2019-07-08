import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../../classes/dateformatter/ngb-date-frparser-formatter';
import { AccountManagerService } from '../../services/accountManager/account-manager.service';
import { LanguageService } from '../../services/language/language.service';
import { SlideInOutAnimation } from '../../classes/animation/fadeInOut/fade-in-out';
import { Contact } from '../../classes/contact/contact';
import { ContactManagerService } from '../../services/contactManager/contact-manager.service';
import { LoginService } from '../../services/login/login.service';
import { Logout } from '../../classes/logout/logout';


@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    animations: [SlideInOutAnimation]
})
export class ContactComponent implements OnInit {
    public animationState: string;
    public animationStateReverse: string;
    public showProgress: boolean;
    public emailLoading: boolean;
    public emailForm: FormGroup;
    public phoneLoading: boolean;
    public phoneForm: FormGroup;
    public facebookLoading: boolean;
    public facebookForm: FormGroup;
    public faxLoading: boolean;
    public faxForm: FormGroup;
    public addressLoading: boolean;
    public addressForm: FormGroup;
    public mobileLoading: boolean;
    public mobileForm: FormGroup;
    public whatsappLoading: boolean;
    public whatsappForm: FormGroup;
    public likedinLoading: boolean;
    public linkedInForm: FormGroup;
    public twitterLoading: boolean;
    public twitterForm: FormGroup;
    public googleplusLoading: boolean;
    public googlePlusForm: FormGroup;
    public instagramLoading: boolean;
    public instagramForm: FormGroup;
    public markerlatLoading: boolean;
    public markerLatForm: FormGroup;
    public markerlongLoading: boolean;
    public markerLongForm: FormGroup;
    public mapapiLoading: boolean;
    public mapApiForm: FormGroup;
    public selectedValue: string;
    public showUpdateButton: boolean;
    public showCancelButton: boolean;
    public pageLoading: boolean;
    public contactConf: Contact;
    public tempContactConf: Contact;
    public emailPattern: string;
    public phonePattern: string;
    public markerPattern: string;
    public logoutS: Logout;

    constructor(
        public mediaMatcher: MediaMatcher,
        public breakpointObserver: BreakpointObserver,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private location: Location,
        private loginService: LoginService,
        private contactManger: ContactManagerService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.animationState = 'in';
        this.animationStateReverse = 'out';
        this.showProgress = false;
        this.pageLoading = false;
        this.showUpdateButton = true;
        this.showCancelButton = false;
        this.emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
        this.phonePattern = '^[0-9]+$';
        this.markerPattern = '^[0-9.,]+$';
        this.contactConf = new Contact();
        this.tempContactConf = new Contact();
        this.logoutS = new Logout(this.loginService, this.router);


        this.emailLoading = false;
        this.phoneLoading = false;
        this.faxLoading = false;
        this.mobileLoading = false;
        this.addressLoading = false;
        this.facebookLoading = false;
        this.whatsappLoading = false;
        this.likedinLoading = false;
        this.twitterLoading = false;
        this.googleplusLoading = false;
        this.instagramLoading = false;
        this.markerlatLoading = false;
        this.markerlongLoading = false;
        this.mapapiLoading = false;

        this.contactManger.getContact().subscribe(
            data => {
                this.contactConf = data;
            },
            error => {
                switch (error) {
                    case 401:
                        this.logoutS.do();
                        break;
                    default:
                        break;
                }
            }
        );

        this.emailForm = new FormGroup({
            'email': new FormControl(this.contactConf.email, Validators.compose([
                Validators.required,
                Validators.pattern(this.emailPattern),
                Validators.maxLength(50),
                Validators.minLength(8)
            ]))
        });

        this.emailForm.valueChanges.subscribe(
            data => {
                if (data.email != null) {
                    this.tempContactConf.email = data.email;
                }
            }
        );
        this.phoneForm = new FormGroup({
            'phone': new FormControl(this.contactConf.phone, Validators.compose([
                Validators.required,
                Validators.pattern(this.phonePattern),
                Validators.minLength(8),
                Validators.maxLength(13)
            ]))
        });

        this.phoneForm.valueChanges.subscribe(
            data => {
                if (data.phone != null) {
                    this.tempContactConf.phone = data.phone;
                }
            }
        );

        this.faxForm = new FormGroup({
            'fax': new FormControl(this.contactConf.fax, Validators.compose([
                Validators.required,
                Validators.pattern(this.phonePattern),
                Validators.minLength(8),
                Validators.maxLength(13)
            ]))
        });

        this.faxForm.valueChanges.subscribe(
            data => {
                if (data.fax != null) {
                    this.tempContactConf.fax = data.fax;
                }
            }
        );

        this.mobileForm = new FormGroup({
            'mobile': new FormControl(this.contactConf.mobile, Validators.compose([
                Validators.required,
                Validators.pattern(this.phonePattern),
                Validators.minLength(8),
                Validators.maxLength(13)
            ]))
        });

        this.mobileForm.valueChanges.subscribe(
            data => {
                if (data.mobile != null) {
                    this.tempContactConf.mobile = data.mobile;
                }
            }
        );

        this.addressForm = new FormGroup({
            'address': new FormControl(this.contactConf.adress, Validators.compose([
                Validators.required,
                Validators.minLength(5)
            ]))
        });

        this.addressForm.valueChanges.subscribe(
            data => {
                if (data.address != null) {
                    this.tempContactConf.adress = data.address;
                }
            }
        );

        this.facebookForm = new FormGroup({
            'facebook': new FormControl(this.contactConf.facebook, Validators.compose([
                Validators.required,
                Validators.minLength(16)
            ]))
        });

        this.facebookForm.valueChanges.subscribe(
            data => {
                if (data.facebook != null) {
                    this.tempContactConf.facebook = data.facebook;
                }
            }
        );

        this.whatsappForm = new FormGroup({
            'whatsapp': new FormControl(this.contactConf.whatsapp, Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(13),
                Validators.pattern(this.phonePattern)
            ]))
        });

        this.whatsappForm.valueChanges.subscribe(
            data => {
                if (data.whatsapp != null) {
                    this.tempContactConf.whatsapp = data.whatsapp;
                }
            }
        );

        this.linkedInForm = new FormGroup({
            'linkedin': new FormControl(this.contactConf.linkedin, Validators.compose([
                Validators.required,
                Validators.minLength(16)
            ]))
        });

        this.linkedInForm.valueChanges.subscribe(
            data => {
                if (data.linkedin != null) {
                    this.tempContactConf.linkedin = data.linkedin;
                }
            }
        );

        this.twitterForm = new FormGroup({
            'twitter': new FormControl(this.contactConf.tweeter, Validators.compose([
                Validators.required,
                Validators.minLength(15)
            ]))
        });

        this.twitterForm.valueChanges.subscribe(
            data => {
                if (data.twitter != null) {
                    this.tempContactConf.tweeter = data.twitter;
                }
            }
        );

        this.googlePlusForm = new FormGroup({
            'googlePlus': new FormControl(this.contactConf.googlePlus, Validators.compose([
                Validators.required,
                Validators.minLength(7)
            ]))
        });

        this.googlePlusForm.valueChanges.subscribe(
            data => {
                if (data.googlePlus != null) {
                    this.tempContactConf.googlePlus = data.googlePlus;
                }
            }
        );

        this.instagramForm = new FormGroup({
            'instagram': new FormControl(this.contactConf.instagram, Validators.compose([
                Validators.required,
                Validators.minLength(17)
            ]))
        });

        this.instagramForm.valueChanges.subscribe(
            data => {
                if (data.instagram != null) {
                    this.tempContactConf.instagram = data.instagram;
                }
            }
        );

        this.markerLatForm = new FormGroup({
            'markerlat': new FormControl(this.contactConf.Markerlat, Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(15),
                Validators.pattern(this.markerPattern)
            ]))
        });

        this.markerLatForm.valueChanges.subscribe(
            data => {
                if (data.markerlat != null) {
                    this.tempContactConf.Markerlat = data.markerlat;
                }
            }
        );

        this.markerLongForm = new FormGroup({
            'markerlong': new FormControl(this.contactConf.Markerlongi, Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(15),
                Validators.pattern(this.markerPattern)
            ]))
        });

        this.markerLongForm.valueChanges.subscribe(
            data => {
                if (data.markerlong != null) {
                    this.tempContactConf.Markerlongi = data.markerlong;
                }
            }
        );

        this.mapApiForm = new FormGroup({
            'mapapi': new FormControl(this.contactConf.mapapi, Validators.compose([
                Validators.required,
                Validators.minLength(30),
                Validators.maxLength(255),
            ]))
        });

        this.mapApiForm.valueChanges.subscribe(
            data => {
                if (data.mapapi != null) {
                    this.tempContactConf.mapapi = data.mapapi;
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
        this.showCancelButton = !this.showCancelButton;
    }

    updateContactMail() {
        if (this.emailForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.emailLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.emailLoading = false;
                    this.toastr.success(this.translate.instant('contactMailUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.emailLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.emailForm);
        }
    }

    updateContactPhone() {
        if (this.phoneForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.phoneLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.phoneLoading = false;
                    this.toastr.success(this.translate.instant('contactPhoneUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.phoneLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.phoneForm);
        }
    }

    updateContactFax() {
        if (this.faxForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.faxLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.faxLoading = false;
                    this.toastr.success(this.translate.instant('contactFaxUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.faxLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.faxForm);
        }
    }

    updateContactMobile() {
        if (this.mobileForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.mobileLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.mobileLoading = false;
                    this.toastr.success(this.translate.instant('contactMobileUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.mobileLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.mobileForm);
        }
    }

    updateContactAddress() {
        if (this.addressForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.addressLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.addressLoading = false;
                    this.toastr.success(this.translate.instant('contactAddressUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.addressLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.addressForm);
        }
    }

    updateContactFacebook() {
        if (this.facebookForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.facebookLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.facebookLoading = false;
                    this.toastr.success(this.translate.instant('contactFacebookUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.facebookLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.facebookForm);
        }
    }

    updateContactWhatsapp() {
        if (this.whatsappForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.whatsappLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.whatsappLoading = false;
                    this.toastr.success(this.translate.instant('contactWhatsappUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.whatsappLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.whatsappForm);
        }
    }

    updateContactLinkedIn() {
        if (this.linkedInForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.likedinLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.likedinLoading = false;
                    this.toastr.success(this.translate.instant('contactLinkedinUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.likedinLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.linkedInForm);
        }
    }

    updateContactTwitter() {
        if (this.twitterForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.twitterLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.twitterLoading = false;
                    this.toastr.success(this.translate.instant('contactTwitterUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.twitterLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.twitterForm);
        }
    }

    updateContactGooglePlus() {
        if (this.googlePlusForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.googleplusLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.googleplusLoading = false;
                    this.toastr.success(this.translate.instant('contactGoogleplusUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.googleplusLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.googlePlusForm);
        }
    }

    updateContactInstagram() {
        if (this.instagramForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.instagramLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.instagramLoading = false;
                    this.toastr.success(this.translate.instant('contactInstagramUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.instagramLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.instagramForm);
        }
    }

    updateContactLatitude() {
        if (this.markerLatForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.markerlatLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.markerlatLoading = false;
                    this.toastr.success(this.translate.instant('contactMarkerlatUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.markerlatLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.markerLatForm);
        }
    }

    updateContactLongitude() {
        if (this.markerLongForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.mapapi = this.contactConf.mapapi;

            this.markerlongLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.markerlongLoading = false;
                    this.toastr.success(this.translate.instant('contactMarkerlongUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.markerlongLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.markerLongForm);
        }
    }

    updateContactMapApi() {
        if (this.mapApiForm.valid) {
            this.tempContactConf.id = this.contactConf.id;
            this.tempContactConf.email = this.contactConf.email;
            this.tempContactConf.phone = this.contactConf.phone;
            this.tempContactConf.fax = this.contactConf.fax;
            this.tempContactConf.mobile = this.contactConf.mobile;
            this.tempContactConf.adress = this.contactConf.adress;
            this.tempContactConf.facebook = this.contactConf.facebook;
            this.tempContactConf.whatsapp = this.contactConf.whatsapp;
            this.tempContactConf.linkedin = this.contactConf.linkedin;
            this.tempContactConf.tweeter = this.contactConf.tweeter;
            this.tempContactConf.googlePlus = this.contactConf.googlePlus;
            this.tempContactConf.instagram = this.contactConf.instagram;
            this.tempContactConf.Markerlat = this.contactConf.Markerlat;
            this.tempContactConf.Markerlongi = this.contactConf.Markerlongi;

            this.mapapiLoading = true;
            this.contactManger.updateContact(this.tempContactConf).subscribe(
                data => {
                    this.mapapiLoading = false;
                    this.toastr.success(this.translate.instant('contactMapapiUpdateSuccess'), this.translate.instant('success') + ' !');
                    this.contactConf = this.tempContactConf;
                    this.tempContactConf = new Contact();
                    this.scrollTop();
                    this.toggleShowDiv();
                },
                error => {
                    this.mapapiLoading = false;
                    this.tempContactConf = new Contact();
                    switch (error) {
                        case 401:
                            this.logoutS.do();
                            break;
                        case 400:
                            this.InvalidData();
                            break;
                        default:
                            this.ServerError();
                            break;
                    }
                }
            );
        } else {
            this.changeStat(this.mapApiForm);
        }
    }

    changeStat(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => { // {1}
            const control = formGroup.get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
        });
    }

    private ServerError() {
        this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
    }

    private InvalidData() {
        this.toastr.info(this.translate.instant('InvalidData'), this.translate.instant('error') + ' !');
    }

    private scrollTop() {
        this.document.documentElement.scrollTop = 0;
    }

    logout() {
        this.logoutS.do();
    }
}
