import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient
} from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatSliderModule,
  DateAdapter
} from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { ToastrModule } from 'ngx-toastr';

import { SidebarModule } from 'ng-sidebar';

import { AvatarModule } from 'ngx-avatar';

import { ProgressBarModule } from 'angular-progress-bar';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';

import { LoginService } from './services/login/login.service';
import { GlobalService } from './services/globalConf/global.service';
import { TokenInterceptorService } from './services/tokenInterceptor/token-interceptor.service';
import { RecoveryComponent } from './components/recovery/recovery/recovery.component';
import { AdminPanelComponent } from './components/adminPanel/admin-panel/admin-panel.component';
import { ReceptionComponent } from './components/mailserver/reception/reception/reception.component';
import { EmissionComponent } from './components/mailserver/emission/emission/emission.component';
import { AccountListComponent } from './components/accountManager/accountList/account-list/account-list.component';
import { AccountManagerService } from './services/accountManager/account-manager.service';
import { MailService } from './services/mail/mail.service';
import { AccountInfoComponent } from './components/accountManager/account-info/account-info.component';
import { LogsManagerService } from './services/logsManager/logs-manager.service';
import { ContactManagerService } from './services/contactManager/contact-manager.service';
import { NewAccountComponent } from './components/accountManager/new-account/new-account.component';
import { LogsAllComponent } from './components/logs/logs-all/logs-all.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { AdminpccService } from './services/adminParentChildConnector/adminpcc.service';
import { PublicComponent } from './components/public/public.component';
import { HomeComponent } from './components/home/home.component';
import { EnterpriseListComponent } from './components/enterprise-list/enterprise-list.component';
import { RegisterComponent } from './components/registration/enterprise/register/register.component';
import { RegisterComponent as CenterRegister } from './components/registration/center/register/register.component';
import { UserRegisterComponent } from './components/registration/user/user-register/user-register.component';
import { CenterListComponent } from './components/centerlist/center-list/center-list.component';
import { EnterpriseManagerService } from './services/enterprise/enterprise-manager.service';
import { CenterManagerService } from './services/center/center-manager.service';
import { OfferManagerService } from './services/offerManager/offer-manager.service';
import { OffersComponent } from './components/offers/offers.component';
import { ListComponent } from './components/jobApplicant/list/list.component';
import { JobApplicantManagerService } from './services/jobApplicant/job-applicant-manager.service';
import { UserSettingsComponent } from './components/accountSettings/users/user-settings/user-settings.component';
import { EnterpriseSettingComponent } from './components/enterprise/enterprise-setting/enterprise-setting.component';
import { AddJobOfferComponent } from './components/jobOffers/addJobOffer/add-job-offer/add-job-offer.component';
import { AddSpecificationComponent } from './components/specification/add-specification/add-specification.component';
import { ListSpecsComponent } from './components/specification/list-specs/list-specs.component';
import { SpecificationInfoComponent } from './components/specification/specificationInfo/specification-info/specification-info.component';
import { JobOfferInfoComponent } from './components/jobOffers/job-offer-info/job-offer-info.component';
import { EnterpriseInfoShowComponent } from './components/enterprise/enterprise-info-show/enterprise-info-show.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdmindashboardComponent,
    RecoveryComponent,
    AdminPanelComponent,
    ReceptionComponent,
    EmissionComponent,
    AccountListComponent,
    AccountInfoComponent,
    NewAccountComponent,
    LogsAllComponent,
    ContactComponent,
    AdminSettingsComponent,
    PublicComponent,
    HomeComponent,
    EnterpriseListComponent,
    RegisterComponent,
    CenterRegister,
    UserRegisterComponent,
    CenterListComponent,
    OffersComponent,
    ListComponent,
    UserSettingsComponent,
    EnterpriseSettingComponent,
    AddJobOfferComponent,
    AddSpecificationComponent,
    ListSpecsComponent,
    SpecificationInfoComponent,
    JobOfferInfoComponent,
    EnterpriseInfoShowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    LayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatSliderModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    AvatarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FlexLayoutModule,
    SidebarModule.forRoot(),
    ProgressBarModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: [
    LoginService,
    AccountManagerService,
    MailService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    GlobalService,
    LogsManagerService,
    ContactManagerService,
    AdminpccService,
    EnterpriseManagerService,
    CenterManagerService,
    OfferManagerService,
    JobApplicantManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
