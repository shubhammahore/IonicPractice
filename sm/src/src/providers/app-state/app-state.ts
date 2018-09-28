import {
  Injectable
} from '@angular/core';
import {
  TerminalDetail
} from '../../models/terminal';
import {
  User
} from '../../models/account';

@Injectable()
export class AppStateProvider {

  constructor() {}


  setTerminal(terminal: TerminalDetail): void {
    sessionStorage.setItem('terminal', JSON.stringify(terminal));
  }

  getTerminal(): TerminalDetail {
    return JSON.parse(sessionStorage.getItem('terminal'));
  }

  deleteTerminal(): void {
    sessionStorage.removeItem('terminal');
    sessionStorage.removeItem('formfeilds');
    sessionStorage.removeItem('sectionItems');
    sessionStorage.setItem('terminalStatus', 'false');
  }

  getFormField(): any {
    return JSON.parse(sessionStorage.getItem('formfeilds'));
  }


  setFormField(fileds: any): void {
    sessionStorage.setItem('formfeilds', JSON.stringify(fileds));
  }

  //  addUser(user: User): void {
  //   localStorage.setItem('userProfile', JSON.stringify(user));
  //  }

  //  getUser(): User {
  //    return JSON.parse(localStorage.getItem('userProfile'));
  //  }

  getSessionItem(): any {
    return JSON.parse(sessionStorage.getItem('sectionItems'));
  }

  setSessionItem(sessionitems: any): void {
    sessionStorage.setItem('sectionItems', JSON.stringify(sessionitems));
  }

  getTerminalStatus(): boolean {
    return JSON.parse(sessionStorage.getItem('terminalStatus'));
  }

  setTerminalStatus(status: string): void {
    sessionStorage.setItem('terminalStatus', status);
  }

  setFCMToken(fcm: string): void {
    localStorage.setItem('FCMToken', fcm);
  }

  getFCMToken(): string {
    return localStorage.getItem('FCMToken');
  }

  setUserProfile(user: any): void {
    localStorage.setItem('UserProfile', JSON.stringify(user));
  }

  getUserProfile(): any {
    return JSON.parse(localStorage.getItem('UserProfile'));
  }

  setAccesToken(currentAccessKey: any): void {
    localStorage.setItem('accesskey', JSON.stringify(currentAccessKey));
  }


  getAccesToken(): any {
    return (JSON.parse(localStorage.getItem('accesskey'))) ? JSON.parse(localStorage.getItem('accesskey')) : [];
  }
  setNotes(currentNotes: any): void {
    localStorage.setItem('note', JSON.stringify(currentNotes));
  }


  getNotes(): any {
    return (JSON.parse(localStorage.getItem('note'))) ? JSON.parse(localStorage.getItem('note')) : [];
  }


  setPlaceOrderInfoArr(PlaceOrderInfoArr: any): void {
    localStorage.setItem('PlaceOrderInfoArr', JSON.stringify(PlaceOrderInfoArr));
  }

  getPlaceOrderInfoArr(): any {
    return JSON.parse(localStorage.getItem('PlaceOrderInfoArr'));
  }


  setOrderResponse(OrderResponse: any): void {
    localStorage.setItem('OrderResponse', JSON.stringify(OrderResponse));
  }

  getOrderResponse(): any {
    return JSON.parse(localStorage.getItem('OrderResponse'));
  }
}
