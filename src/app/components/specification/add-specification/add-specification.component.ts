import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AdminpccService } from '../../../services/adminParentChildConnector/adminpcc.service';
import { AccountManagerService } from '../../../services/accountManager/account-manager.service';
import { LoginService } from '../../../services/login/login.service';
import { GlobalService } from '../../../services/globalConf/global.service';
import { LanguageService } from '../../../services/language/language.service';
import { Logout } from '../../../classes/logout/logout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { OfferManagerService } from 'src/app/services/offerManager/offer-manager.service';
import { Specification } from 'src/app/classes/specification/specification';
import { EnterpriseManagerService } from 'src/app/services/enterprise/enterprise-manager.service';
@Component({
  selector: 'app-add-specification',
  templateUrl: './add-specification.component.html',
  styleUrls: ['./add-specification.component.css']
})
export class AddSpecificationComponent implements OnInit {
  public showProgress: boolean;
  public specification: Specification;
  public logoutS: Logout;
  public specificationForm: FormGroup;
  public pdfMissing: boolean;
  public showUploadProgress: boolean;
  public AllowedSize: number;
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
    public ref: ElementRef,
    public enterpriseManager: EnterpriseManagerService
  ) {
    this.showProgress = false;
    this.pdfMissing = false;
    this.showUploadProgress = false;
    this.specification = new Specification();
    this.logoutS = new Logout(this.loginService, this.router);
    this.AllowedSize = 200;
    this.specificationForm = new FormGroup({
      'description': new FormControl('', Validators.required)
    });
    this.specificationForm.valueChanges.subscribe(data => {
      if (data.description && data.description !== '') {
        this.specification.description = data.description;
      }
    });
  }

  ngOnInit() {
  }

  logout() {
    this.logoutS.do();
  }

  addSpecification() {
    const files = this.ref.nativeElement.querySelector('#specationPdf').files;
    if (files && files[0]) {
      this.showUploadProgress = true;
      this.pdfMissing = false;
      this.showUploadProgress = true;
      const formData: FormData = new FormData();
      formData.append('specationPdf', files[0], files[0].name);
      formData.append('description', this.specification.description);
      this.enterpriseManager.addSpecification(formData).subscribe(data => {
        this.showUploadProgress = false;
        switch (data.response) {
          case 'OK':
            this.router.navigate(['/'], { relativeTo: this.route.parent });
            break;
          case 'SERVER_UPLOAD_ERR':
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
          case 'SERVER_UPLOAD_DIR_ERR':
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
          case 'FILE_FORMAT_ERR':
            this.toastr.error(this.translate.instant('allowedFormat') + 'jpg,jpeg,png', this.translate.instant('error') + '!');
            break;
          case 'FILE_SIZE_ERR':
            this.toastr.error(this.translate.instant('maxImageSize') + this.AllowedSize + 'Ko', this.translate.instant('error') + ' !');
            break;
          default:
            this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error') + ' !');
            break;
        }
      }, error => {
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
      });
    } else {
      this.pdfMissing = true;
    }
  }

}
