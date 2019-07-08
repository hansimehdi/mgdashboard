import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { GlobalService } from '../globalConf/global.service';

import { AccountC } from '../../classes/account/account-c';
import { User } from 'src/app/classes/user/user';

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {
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

  listAccount(start: number, perpage: number): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/accounts', { start, perpage }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getAccount(id: string): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/account', { id }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCurrent(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'AccountsManager/current', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  registerAccount(account: AccountC): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/register', account, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  deleteAccount(id: string): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/delete', { id }, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  blockAccount(id: string, blockExpire: string): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/block', { id, blockExpire }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  unlockAccount(id: string, expire: string): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/unlock', { id, expire }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateTimeZone(tz: string): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/updateTimeZone', { tz }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }


  changeProfilePictue(formdata: FormData): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/changeProfilePicture', formdata).pipe(
      catchError(this.handleError)
    );
  }

  updateFullName(fullname: any): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/updateFullName', fullname, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  updateEmail(Email: any): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/updateEmail', Email, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  updatePhone(phone: any): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/updatePhone', phone, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  updatePassword(password: any): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/updatePassword', password, this.headers).pipe(
      catchError(this.handleError)
    );
  }


  addSimpleAccount(user: AccountC): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/add', user, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  getUserDetail(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'AccountsManager/details', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateDetails(data: FormData): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'AccountsManager/updatedetails', data).pipe(
      catchError(this.handleError)
    );
  }

  getSubUser(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'AccountsManager/getSubUser', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    /* if (error.error instanceof ErrorEvent) {
       // A client-side or network error occurred. Handle it accordingly.
       console.error('An error occurred:', error.error.message);
     } else {
       // The backend returned an unsuccessful response code.
       // The response body may contain clues as to what went wrong,
       console.error(
         `Backend returned code ${error.status}, ` +
         `body was: ${error.error}`);
     }*/
    return throwError(error.status);
  }
}
