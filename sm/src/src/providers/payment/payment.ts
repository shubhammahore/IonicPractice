import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import{UpdatePayment,PaymentOption} from '../../models/placeorder'
/*
  Generated class for the PaymentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaymentProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PaymentProvider Provider');
  }


update(updatePayment:UpdatePayment):Observable<any>{
  const url=`${environment.apiUrl}PayUBiz/updatePaymentMethod.php?WrioCode=${updatePayment.WrioCode}&TokenId=${updatePayment.TokenId}&LogId=${updatePayment.LogId}&PaymentMethod=${updatePayment.PaymentMethod}`;
  return this.http.get(url,{responseType:'text'}).catch(this.serverError);
  
}


paymentOption(TerminalId:number):Observable<Array<PaymentOption>>{
  const url=`${environment.apiUrl}PaymentOptions.php`;
  let body = new FormData();
  body.append('TerminalId',TerminalId.toString());
 return this.http.post<Array<PaymentOption>>(url,body).catch(this.serverError);
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
