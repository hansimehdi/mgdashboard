import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { GlobalService } from '../globalConf/global.service';
import { retry, catchError } from 'rxjs/operators';
import { Offer } from 'src/app/classes/offer';
@Injectable({
  providedIn: 'root'
})
export class OfferManagerService {
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

  list(): Observable<any> {
    return this.httpService.get<any>(this.gs.getUrl() + 'JobOfferManager/list', this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  add(offer: Offer): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'JobOfferManager/add', offer, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  addIntersetd(id: string): Observable<any> {
    return this.httpService.post(this.gs.getUrl() + 'JobOfferManager/addInterseted', { id }, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  offerInfo(id: string): Observable<any> {
    return this.httpService.post(this.gs.getUrl() + 'JobOfferManager/offerinfo', { id }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  deleteOffer(id: string): Observable<any> {
    return this.httpService.post<any>(this.gs.getUrl() + 'JobOfferManager/delete', { id }, this.headers).pipe(
      retry(3),
      catchError(this.handleError)
    )
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
