import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { GlobalService } from '../globalConf/global.service';
import { EnterpriseAccount } from 'src/app/classes/enterprise/enterprise-account';
import { retry, catchError } from 'rxjs/operators';
import { CenterAccount } from 'src/app/classes/center/center-account';
@Injectable({
  providedIn: 'root'
})
export class CenterManagerService {
  private headers;
  constructor(private gs: GlobalService, private httpService: HttpClient) {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'agent': 'web'
      })
    };
  }

  register(center: CenterAccount): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'CenterManager/register',
        center,
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  list(): Observable<any> {
    return this.httpService
      .get<any>(this.gs.getUrl() + 'CenterManager/list', this.headers)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  search(keyword: string): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'CenterManager/search',
        { keyword },
        this.headers
      )
      .pipe(
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
