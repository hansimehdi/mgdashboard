import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { GlobalService } from '../globalConf/global.service';
@Injectable({
  providedIn: 'root'
})
export class LogsManagerService {
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

  getAccountLogs(id: string, start: number, perpage: number): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'LogsManager/account_logs', { id, start, perpage }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getLogs(start: number, perpage: number): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'LogsManager/all_logs', { start, perpage }, this.headers).pipe(
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
