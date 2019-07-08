import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../services/login/login.service';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  public showProgress: boolean;
  public lang: string;
  constructor(
    public mediaMatcher: MediaMatcher ,
    public breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private languageSwitcher: LanguageService,
    private translate: TranslateService
  ) {
    this.showProgress = false;
    this.lang = '';
   }
  ngOnInit() {
    this.lang = this.languageSwitcher.getLang();
    this.translate.setDefaultLang(this.lang);
  }

}
