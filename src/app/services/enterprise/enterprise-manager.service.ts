import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Comment } from 'src/app/classes/comment/comment';
import { Enterprise } from 'src/app/classes/enterprise/enterprise';
import { EnterpriseAccount } from 'src/app/classes/enterprise/enterprise-account';

import { GlobalService } from '../globalConf/global.service';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseManagerService {
  private headers;
  constructor(private gs: GlobalService, private httpService: HttpClient) {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'agent': 'web'
      })
    };
  }

  register(enterpriser: EnterpriseAccount): Observable<any> {
    return this.httpService
      .post(
        this.gs.getUrl() + 'EnterpriseManager/register',
        enterpriser,
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  list(): Observable<any> {
    return this.httpService
      .get(this.gs.getUrl() + 'EnterpriseManager/list', this.headers)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  current(): Observable<any> {
    return this.httpService
      .get<any>(this.gs.getUrl() + 'EnterpriseManager/current', this.headers)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  update(data: Enterprise): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'EnterpriseManager/update',
        data,
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  addSpecification(data: FormData): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'EnterpriseManager/addSpecification',
        data,
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  listSpecifications(): Observable<any> {
    return this.httpService
      .get(
        this.gs.getUrl() + 'EnterpriseManager/listSpecification',
        this.headers
      )
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getSpecification(id: string): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'EnterpriseManager/specificationInfo',
        { id },
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  commentSpecification(comment: Comment): Observable<any> {
    return this.httpService
      .post(
        this.gs.getUrl() + 'EnterpriseManager/commentSpecs',
        comment,
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  deleteSpecification(id: string): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'EnterpriseManager/deleteSpecs',
        { id },
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  get(id: string): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'EnterpriseManager/get',
        { id },
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  search(keyword: string): Observable<any> {
    return this.httpService
      .post<any>(
        this.gs.getUrl() + 'EnterpriseManager/search',
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
