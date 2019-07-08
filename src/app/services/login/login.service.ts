import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { GlobalService } from '../globalConf/global.service';

import { Login } from '../../interfaces/login/login';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private headers;
  constructor(
    private gs: GlobalService,
    private httpService: HttpClient,
  ) {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'agent': 'web'
      })
    };
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  handleError(error: HttpErrorResponse) {
     /*if (error.error instanceof ErrorEvent) {
       // A client-side or network error occurred. Handle it accordingly.
       console.error('An error occurred:', error.error.message);
     } else {
       // The backend returned an unsuccessful response code.
       // The response body may contain clues as to what went wrong,
       console.error(
         `Backend returned code ${error.status}, ` +
         `body was: ${error.error}`);
     }*/
    return throwError(error);
  }

  doLogin(login: Login): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'Authentication/login', login, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'Authentication/role', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    if (this.isLoggedIn) {
      return this.httpService.get<any>(this.gs.getUrl() + 'Authentication/logout', this.headers).pipe(
        retry(3),
        catchError(this.handleError)
      );
    } else {
      return null;
    }
  }
}
