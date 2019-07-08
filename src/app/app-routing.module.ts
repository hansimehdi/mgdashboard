import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EnterpriseListComponent } from './components/enterprise-list/enterprise-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OffersComponent } from './components/offers/offers.component';
import { PublicComponent } from './components/public/public.component';
import { AccountInfoComponent } from './components/accountManager/account-info/account-info.component';
import { AdminPanelComponent } from './components/adminPanel/admin-panel/admin-panel.component';
import { CenterListComponent } from './components/centerlist/center-list/center-list.component';
import { EnterpriseSettingComponent } from './components/enterprise/enterprise-setting/enterprise-setting.component';
import { ListComponent } from './components/jobApplicant/list/list.component';
import { JobOfferInfoComponent } from './components/jobOffers/job-offer-info/job-offer-info.component';
import { LogsAllComponent } from './components/logs/logs-all/logs-all.component';
import { RecoveryComponent } from './components/recovery/recovery/recovery.component';
import { AddSpecificationComponent } from './components/specification/add-specification/add-specification.component';
import { ListSpecsComponent } from './components/specification/list-specs/list-specs.component';
import { NewAccountComponent } from './components//accountManager/new-account/new-account.component';
import { AccountListComponent } from './components/accountManager/accountList/account-list/account-list.component';
import { UserSettingsComponent } from './components/accountSettings/users/user-settings/user-settings.component';
import { AddJobOfferComponent } from './components/jobOffers/addJobOffer/add-job-offer/add-job-offer.component';
import { EmissionComponent } from './components/mailserver/emission/emission/emission.component';
import { ReceptionComponent } from './components/mailserver/reception/reception/reception.component';
import { RegisterComponent as CenterRegister } from './components/registration/center/register/register.component';
import { RegisterComponent } from './components/registration/enterprise/register/register.component';
import { UserRegisterComponent } from './components/registration/user/user-register/user-register.component';
import { SpecificationInfoComponent } from './components/specification/specificationInfo/specification-info/specification-info.component';
import { EnterpriseInfoShowComponent } from './components/enterprise/enterprise-info-show/enterprise-info-show.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'public',
    component: PublicComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'enterpriselist',
        component: EnterpriseListComponent
      },
      {
        path: 'centerlist',
        component: CenterListComponent
      },
      {
        path: 'offerslist',
        component: OffersComponent
      },
      {
        path: 'jobapplicantlist',
        component: ListComponent
      },
      {
        path: 'enterpriseregister',
        component: RegisterComponent
      },
      {
        path: 'centeregister',
        component: CenterRegister
      },
      {
        path: 'useregister',
        component: UserRegisterComponent
      },
      {
        path: 'usersettings',
        canActivate: [AuthenticationGuard],
        component: UserSettingsComponent
      },
      {
        path: 'enterprisesettings',
        canActivate: [AuthenticationGuard],
        component: EnterpriseSettingComponent
      },
      {
        path: 'addoffer',
        canActivate: [AuthenticationGuard],
        component: AddJobOfferComponent
      },
      {
        path: 'addspecification',
        canActivate: [AuthenticationGuard],
        component: AddSpecificationComponent
      },
      {
        path: 'listspecifications',
        canActivate: [AuthenticationGuard],
        component: ListSpecsComponent
      },
      {
        path: 'specificationinfo/:id',
        canActivate: [AuthenticationGuard],
        component: SpecificationInfoComponent
      },
      {
        path: 'jobofferinfo/:id',
        component: JobOfferInfoComponent
      },
      {
        path: 'enterpriseinfo/:id',
        component: EnterpriseInfoShowComponent
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticationGuard],
    component: DashboardComponent
  },
  {
    path: 'admindashboard',
    canActivate: [AuthenticationGuard],
    component: AdmindashboardComponent,
    children: [
      {
        path: 'adminpanel',
        component: AdminPanelComponent
      },
      {
        path: 'mailemission',
        component: EmissionComponent
      },
      {
        path: 'mailrecption',
        component: ReceptionComponent
      },
      {
        path: 'accountsList',
        component: AccountListComponent
      },
      {
        path: 'accountinfo/:id',
        component: AccountInfoComponent
      },
      {
        path: 'newAccount',
        component: NewAccountComponent
      },
      {
        path: 'logs',
        component: LogsAllComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'adminsetting',
        component: AdminSettingsComponent
      }
    ]
  },
  {
    path: 'accountrecovery',
    component: RecoveryComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponent = [
  DashboardComponent,
  AdmindashboardComponent,
  LoginComponent,
  RecoveryComponent,
  AdminPanelComponent,
  EmissionComponent,
  ReceptionComponent,
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
  ListComponent,
  UserSettingsComponent,
  EnterpriseSettingComponent,
  AddJobOfferComponent,
  AddSpecificationComponent,
  ListSpecsComponent,
  SpecificationInfoComponent,
  JobOfferInfoComponent,
  EnterpriseInfoShowComponent
];
