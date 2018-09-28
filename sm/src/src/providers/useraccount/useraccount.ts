import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ViewLog } from '../../models/viewlog/';


/*
  Generated class for the UseraccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UseraccountProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UseraccountProvider Provider');
  }

  getUserCheckInLog(userId: string, startDate: any, endDate: any): Observable <Array<ViewLog>> {
    const url = `${environment.apiUrl}ClientFunctions.php?function=GetUserCheckInLog&UserId=${userId}&StartDate=${startDate}&EndDate=${endDate}`;
    return this.http.get<Array<ViewLog>>(url).catch(this.serverError);
  }

  /**
   * This method is used to return server error
   * @param  {any} err
   */
  private serverError(err: any) {
    if (err) {
      return Observable.throw(err);
    }
    return Observable.throw(err || 'Server error');
  }
  
}
