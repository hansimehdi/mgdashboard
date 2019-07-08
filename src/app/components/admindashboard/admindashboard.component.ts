import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../services/login/login.service';
import { LanguageService } from '../../services/language/language.service';
import { Logout } from '../../classes/logout/logout';
import { AdminpccService } from '../../services/adminParentChildConnector/adminpcc.service';
import { AccountManagerService } from '../../services/accountManager/account-manager.service';
import { GlobalService } from '../../services/globalConf/global.service';
import * as jwt_decode from 'jwt-decode';



@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit, OnDestroy {
  private _opened = true;
  private _modeNum = 1;
  private _positionNum = 0;
  private _dock = false;
  private _closeOnClickOutside = false;
  private _closeOnClickBackdrop = false;
  private _showBackdrop = false;
  private _animate = true;
  private _trapFocus = true;
  private _autoFocus = true;
  private _keyClose = false;
  private _autoCollapseHeight: number = null;
  private _autoCollapseWidth: number = null;
  private isNavbarCollapsed = true;
  private logoutS: Logout;
  public serverBase: string;
  public projectName: string;

  private _MODES: Array<string> = ['over', 'push', 'slide'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  private _COLOR: Array<string> = ['#8e24aa', '#f50057', '#283593', '#e64a19', '#0d47a1', '#e53935'];
  private _avatarColor = '';
  public lang: string;
  public matcher: MediaQueryList;
  public profilePicture: string;
  public accountName: string;
  public accountFirstname: string;
  constructor(
    public mediaMatcher: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private languageSwitcher: LanguageService,
    private translate: TranslateService,
    public connector: AdminpccService,
    public accountManager: AccountManagerService,
    private gs: GlobalService
  ) {
    this.getCurrent();
    this.serverBase = this.gs.getUrl();
    this.projectName = this.gs.getProjectName();
    this.loginService.getRole().subscribe(
      data => {
        if (data.message.info.role !== 'sa') {
          this.router.navigate(['/']);
        }
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
    this.logoutS = new Logout(this.loginService, this.router);
    this.lang = this.languageSwitcher.getLang();
    this.translate.setDefaultLang(this.lang);
    this.breakpointObserver
      .observe(['(min-width:768px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this._modeNum = 1;
          this._opened = true;
          this._closeOnClickOutside = false;
        } else {
          this._modeNum = 0;
          this._opened = false;
          this._closeOnClickOutside = true;
        }
      });
    this.matcher = this.mediaMatcher.matchMedia('(min-width: 768px)');
    this.matcher.addListener(this.myListener);
    const val = Math.floor(Math.random() * 5);
    this._avatarColor = this._COLOR[val];
    this.router.navigate(['adminpanel'], { relativeTo: this.route });
    this.connector.currentMessage.subscribe(
      message => {
        switch (message) {
          case 'SETTINGS_CHANGED':
            this.getCurrent();
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy() {
    this.matcher.removeListener(this.myListener);
  }

  myListener(event) {
    if (event.matches) {
      this._modeNum = 1;
      this._opened = true;
      this._closeOnClickOutside = false;
    } else {
      this._modeNum = 0;
      this._opened = false;
      this._closeOnClickOutside = true;
    }
  }

  private _toggleOpened(): void {
    this._opened = !this._opened;
  }

  private _toggleMode(): void {
    this._modeNum++;

    if (this._modeNum === this._MODES.length) {
      this._modeNum = 0;
    }
  }

  private _toggleAutoCollapseHeight(): void {
    this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
  }

  private _toggleAutoCollapseWidth(): void {
    this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
  }

  private _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }

  private _toggleDock(): void {
    this._dock = !this._dock;
    this._opened = !this._opened;
  }

  private _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
  }

  private _toggleCloseOnClickBackdrop(): void {
    this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
  }

  private _toggleShowBackdrop(): void {
    this._showBackdrop = !this._showBackdrop;
  }

  private _toggleAnimate(): void {
    this._animate = !this._animate;
  }

  private _toggleTrapFocus(): void {
    this._trapFocus = !this._trapFocus;
  }

  private _toggleAutoFocus(): void {
    this._autoFocus = !this._autoFocus;
  }

  private _toggleKeyClose(): void {
    this._keyClose = !this._keyClose;
  }

  private _onOpenStart(): void {
  }

  private _onOpened(): void {
  }

  private _onCloseStart(): void {
  }

  private _onClosed(): void {
  }

  private _onTransitionEnd(): void {
  }

  private _onBackdropClicked(): void {
  }

  private _toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  changeLang(lang: string) {
    this.lang = lang;
    this.translate.use(lang);
    this.languageSwitcher.changeLang(lang);
  }

  activateClass(subModule) {
    subModule.active = !subModule.active;
  }

  switchEmission() {
    this.router.navigate(['mailemission'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchReception() {
    this.router.navigate(['mailrecption'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchDashboard() {
    this.router.navigate(['adminpanel'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchAccountsList() {
    this.router.navigate(['accountsList'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchNewAccount() {
    this.router.navigate(['newAccount'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchLogs() {
    this.router.navigate(['logs'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchContact() {
    this.router.navigate(['contact'], { relativeTo: this.route });
    this.toggleSideNav();
  }

  switchStettings() {
    this.router.navigate(['adminsetting'], { relativeTo: this.route });
  }
  logout() {
    this.logoutS.do();
  }

  toggleSideNav() {
    this.breakpointObserver
      .observe(['(min-width:768px)'])
      .subscribe((state: BreakpointState) => {
        if (!state.matches) {
          this._opened = false;
        }
      });
  }
  getCurrent() {
    this.accountManager.getCurrent().subscribe(
      data => {
        if (!data.current) {
        } else if (data.current.id.length !== '') {
          this.accountFirstname = data.current.firstname;
          this.accountName = data.current.username;
          this.profilePicture = data.current.profilePicture.url;
        } else {

        }
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
      }
    );
  }
}
