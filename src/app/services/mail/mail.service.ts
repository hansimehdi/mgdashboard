import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { GlobalService } from '../globalConf/global.service';
import { MailServer } from '../../classes/mail/mail-server';
@Injectable({
  providedIn: 'root'
})
export class MailService {
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

  getEmission(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'MailServer/emission', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getRecption(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'MailServer/reception', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateServer(config: MailServer): Observable<any> {
    return this.httpService.post(this.gs.getUrl() + 'MailServer/UpdateServer', config, this.headers).pipe(
      catchError(this.handleError)
    );
  }
}
