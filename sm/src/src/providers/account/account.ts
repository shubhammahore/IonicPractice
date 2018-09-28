import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OTPInfo, User } from '../../models/account';
import { environment } from '../../environments/environment';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import{TerminalDetail} from '../../models/terminal';



@Injectable()
export class AccountProvider {


  constructor(public http: HttpClient, private fb: Facebook, private googlePlus: GooglePlus) {}

  /**
   * @param  {OTP} oTP
   * @returns Observable
   */
  generateOTP(oTP: OTPInfo): Observable<object> {

    const url = `${environment.apiUrl}OTP/?CountryCode=${oTP.countryCode}&MobileNo=${oTP.phoneNumber}`;
    return this.http.get < object > (url).catch(this.serverError);
  }

  /**
   * @param  {OTP} oTP
   * @returns Observable
   */
  oTPVerification(oTP: OTPInfo): Observable<any> {
 
    
    const url = `${environment.apiUrl}OTP/auth_OTP_app/index.php?OTP=${oTP.OTP}&MobileNo=${oTP.countryCode+oTP.phoneNumber}`;
    return this.http.get < any > (url).catch(this.serverError);
  }


  /**
   * @param  {} userid
   * @returns Promise
   */
  getUserDetailThroughFacebook(userid): Promise < any > {
    return this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"]).catch(this.serverError);
  }

  loginThroughFacebook(): Promise < any > {
    return this.fb.login(['public_profile', 'user_friends', 'email']).catch(this.serverError);
  }

  loginThroughGoogle(): Promise < any > {
    return this.googlePlus.login({}).catch(this.serverError);
  }

  logout() {
    this.fb.logout()
      .then(res => console.log(res))
      .catch(e => console.log('Error logout from Facebook', e));
  }

  clientLogin(emailId: string): Observable <any> {
    const fcmToken: string = localStorage.getItem('FCMToken');
    let deviceOs = 'android';
    const url = `${environment.apiUrl}ClientFunctions.new.php?function=ClientLogin&Uname=@&EmailId=${emailId}&DeviceARN=${fcmToken}&DeviceOS=${deviceOs}&FCMToken=${fcmToken}`
   
    return this.http.get <any>(url).catch(this.serverError);
  }

  getUserAcccountInfo(userId: number): Observable<any> {
    const url = `${environment.apiUrl}ClientFunctions.php?function=GetUserAccountImage&UserId=${userId}`;
    return this.http.get<any>(url).catch(this.serverError);
  }

  getInfo(accountId: string): Observable < any > {
    const url = `${environment.apiUrl}ClientFunctions.php?function=GetAccountInfo&AccountId=${accountId}`;
    return this.http.get < any > (url).catch(this.serverError);
  }

  UserLoginOrRegister(user: User): Observable < any > {
 
    const url = `${environment.apiUrl}ClientFunctions.new.php`;
    let body = new FormData();
    body.append('function', 'UserLoginOrRegister');
    body.append('Uname', user.Uname);
    body.append('EmailId', user.EmailId);
    body.append('Image', user.Image);
    body.append('DeviceARN', user.DeviceARN);
    body.append('DeviceOS', user.DeviceOS);
    body.append('UserRole', user.UserRole);

    return this.http.post(url, body).catch(this.serverError);

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
