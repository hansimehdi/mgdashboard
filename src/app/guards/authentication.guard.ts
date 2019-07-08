import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  canActivate() {
    if (this.check()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private check(): boolean {
    return this.loginService.isLoggedIn();
  }
}
