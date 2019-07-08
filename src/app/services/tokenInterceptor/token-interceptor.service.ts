import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private auth: LoginService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!!localStorage.getItem('token')) {
      const tokenized = request.clone({
        headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
          .set('agent', 'web')
      });
      return next.handle(tokenized);
    } else {
      return next.handle(request);
    }
  }
}
