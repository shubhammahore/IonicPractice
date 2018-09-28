import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  Terminal,
  TerminalDetail,
  FormField,
  Value,
  Section,
  Item,
  NoOrder,
  TimeSlots
} from '../../models/terminal';
import {
  environment
} from '../../environments/environment';
import * as _ from 'lodash';
import {
  PlaceOrder
} from '../../models/placeorder';
import * as moment from 'moment';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Authorization': ''
//   })
// };

@Injectable()
export class TerminalProvider {

  constructor(public http: HttpClient) {}





  serach(terminalName: string): Observable < Array < Terminal >> {
    const url = `${environment.apiUrl}ClientFunctions.php?function=SearchTerminal&SearchString=${terminalName}`;
    return this.http.get < Array < Terminal >> (url).catch(this.serverError);
  }

  getall(): Observable < Array < Terminal >> {
    const url = `${environment.apiUrl}getAdsSlideShow.php`;
    return this.http.get < Array < Terminal >> (url).catch(this.serverError);
  }

  getById(wiroid: string): Observable < TerminalDetail > {
    const url = `${environment.apiUrl}ClientFunctions.new.php?function=GetTerminalFormDetails&TerminalId=${wiroid} `;
    return this.http.get < any > (url).map(res => {
      let terminal = new TerminalDetail();
      terminal.Id = res._id.$id;
      terminal.WrioCode = wiroid;
      terminal.FormName = res.FormName;
      terminal.AccountId = res.AccountId;
      terminal.BusinessName = res.BusinessName;
      terminal.SessionId = res.SessionId;
      terminal.CheckedIn = res.CheckedIn;
      terminal.TerminalName = res.TerminalName;
      terminal.BusinessDescription = res.BusinessDescription;
      terminal.Image = res.Image;
      terminal.TerminalId = res.TerminalId;
      terminal.TerminalImageLinks = (res.TerminalImageLinks) ? res.TerminalImageLinks : [];
      terminal.WebLink = res.WebLink;
      terminal.TerminalAccessKey = res.TerminalAccessKey;
      terminal.TransactionToken = res.TransactionToken;
      terminal.Disclaimer = res.Disclaimer;
      terminal.CurrencySymbol = res.CurrencySymbol;
      terminal.FT = res.FT;
      terminal.Pay = res.Pay;
      terminal.CN = res.CN;

      if ("DeliveryCharges" in res) {
        terminal.DeliveryCharges = res.DeliveryCharges;
      } else {
        terminal.DeliveryCharges = 0;
      }

      if ("AskComment" in res) {
        terminal.AskComment = res.AskComment;
      }
      if ("CommentMessage" in res) {
        terminal.CommentMessage = res.CommentMessage;
      }
      if ("OrderAssure" in res) {
        terminal.OrderAssure = res.OrderAssure;
      }
      if ("OrderAssureMessage" in res) {
        terminal.OrderAssureMessage = res.OrderAssureMessage;
      }

      terminal.AllowNoOrder = res.AllowNoOrder;
      terminal.FormField = [];
      let prevSectionId = '';

      _.forEach(res.FormField, function (value, index) {
        if (value.SectionName == "NO ORDER") {
          const noorder = new NoOrder();
          const valueItem = JSON.parse(value.FId);
          noorder.section_Id = value.FId;
          noorder.section_Email = value.section_Email;
          noorder.FId = valueItem._id.$id;
          noorder.price = value.Price;
          noorder.Qty = value.QTY;
          noorder.Fname = value.SectionName;
          terminal.MarkNoOrder.push(noorder);
        }
        if (!value.SectionID) {

          const formfield = new FormField()
          let FId: any;
          FId = JSON.parse(value.FId[0]);
          formfield.M = value.M;
          formfield.FN = FId.FN;
          formfield.DT = FId.DT;
          formfield.KT = FId.KT;
          formfield.SQ = +value.SQ;
          formfield.id = FId._id.$id;
          if (FId.DT == 'DD') {
            formfield.Values = FId.Values;
          }
          terminal.FormField.push(formfield);
        } else {
          const section = new Section();
          const index = terminal.Sections.findIndex(obj => obj.SectionID === value.SectionID);


          if (index != -1) {
            const item = new Item();
            const valueItem = JSON.parse(value.FId);
            item.section_Id = value.SectionID;
            item.section_Email = value.section_Email;
            item.Id = valueItem._id.$id;
            item.FN = valueItem.FN;
            item.Tag = value.Tag;
            item.Barcode = valueItem.Barcode;
            item.Image = valueItem.Image;
            item.Price = +value.Price;
            item.QTY = value.QTY;
            item.Ref1_Label = valueItem.Ref1_Label;
            item.Ref1_Desc = valueItem.Ref1_Desc;
            item.Ref2_Label = valueItem.Ref2_Label;
            item.Ref2_Desc = value.Ref2_Desc;
            item.UnitOfSale = valueItem.UnitOfSale;
            //const index = terminal.Sections.findIndex(obj => obj.SectionID === value.SectionID);
            terminal.Sections[index].Items.push(item);
          } else {

            const item = new Item();
            const valueItem = JSON.parse(value.FId);
            section.SectionID = value.SectionID;
            section.SectionName = value.SectionName;
            item.section_Id = value.SectionID;
            item.section_Email = value.section_Email;
            item.Id = valueItem._id.$id;
            item.FN = valueItem.FN;
            item.Barcode = valueItem.Barcode;
            item.Image = valueItem.Image;
            item.Price = +value.Price;
            item.QTY = value.QTY;
            item.Tag = value.Tag;
            item.Ref1_Label = valueItem.Ref1_Label;
            item.Ref1_Desc = valueItem.Ref1_Desc;
            item.Ref2_Label = valueItem.Ref2_Label;
            item.Ref2_Desc = value.Ref2_Desc;
            item.UnitOfSale = valueItem.UnitOfSale;
            section.SQ = value.SQ;
            section.Visible = false;
            section.Items.push(item);
            section.Available_QTY = value.Available_QTY;

            terminal.Sections.push(section);
            prevSectionId = value.SectionID;
          }
        }

      });

      _.forEach(res.section, (value) => {
        let sectionIndex = terminal.Sections.findIndex(obj => obj.SectionID === value._id.$id);
        if (sectionIndex !== -1) {
          terminal.Sections[sectionIndex].Image = value.Image;
        }
      });

      terminal.TimeSlots = res.TimeSlots;
      terminal.ServiceGroups = res.ServiceGroups;
      return terminal;
    }).catch(this.serverError);
  }

  getRecentTerminals(userId: number): Observable < Array < Terminal >> {

    const url = `${environment.apiUrl}getRecentTerminalsForUser.php?UserId=${userId}`;
    return this.http.get < Array < Terminal >> (url).catch(this.serverError);
  }


  placeOrder(order: PlaceOrder): Observable < any > {
    const url = `${environment.apiUrl}CreateCheckInLogAPI_New.php`;

    let body = new FormData();

    if ((order.FormType == 'ER' && order.InfoArray.ItemsArray.length == 0) || order.FormType == 'CO') {
      delete order.InfoArray['ItemsArray'];
      order.InfoArray.totalItems = '0';

    }
    let info = order.InfoArray;

    body.append('InfoArray', JSON.stringify(info));
    body.append('AccountId', order.AccountId);
    body.append('SessionId', order.SessionId);
    body.append('TransactionToken', order.TransactionToken);
    body.append('NotiFlag', order.NotiFlag);
    body.append('isRemoteCheckIn', order.isRemoteCheckIn);
    body.append('PaymentPaypal', order.PaymentPaypal);
    body.append('IsPayment', order.IsPayment);
    body.append('PaymentMethod', order.PaymentMethod);
    body.append('FormType', order.FormType);
    if (order.NoOrder == 'Y') {
      body.append('NoOrder', order.NoOrder)
    }

    return this.http.post < any > (url, body, {
      responseType: 'json'
    }).catch(this.serverError);
  }
  //http://devapi.checkmeinweb.com/APIv2/ClientFunctions.new.php?function=CreateDateSlotes&FormId=59b383f49f605036208b4573&Date=29-07-2018&GroupId=5970a46a9f6050c346e69e65 


  getTimeSlots(FormId: string, GroupId: string, SlotDate: string): Observable < any > {
    const url = `${environment.apiUrl}ClientFunctions.new.php?function=CreateDateSlotes&FormId=${FormId}&Date=${SlotDate}&GroupId=${GroupId}`;
    return this.http.get(url, {
      responseType: 'json'
    }).catch(this.serverError);
  }
  getTransactionToken(wirocode: string, UserId: number): Observable < any > {
    const url = `${environment.apiUrl}ClientFunctions.php?function=getTransactionToken&$WrioCode=${wirocode}&UserId=${UserId}`;

    return this.http.get(url, {
      responseType: 'text'
    }).catch(this.serverError);
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