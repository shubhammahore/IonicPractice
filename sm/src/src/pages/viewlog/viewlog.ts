import { ViewLog } from './../../models/viewlog';
import { UseraccountProvider } from './../../providers/useraccount/useraccount';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  AppStateProvider
} from '../../providers/app-state';
import * as moment from 'moment';
import { float } from 'aws-sdk/clients/lightsail';


/**
 * Generated class for the ViewlogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewlog',
  templateUrl: 'viewlog.html',
})
export class ViewlogPage {
  user: any;
  startDate = '';
  endDate = '';
  total: number;

  viewLogList: Array<ViewLog> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private useraccountProvider: UseraccountProvider, private appState: AppStateProvider) {
    this.user = this.appState.getUserProfile();
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ViewlogPage');
  }

  parseViewLog() {
    if (this.startDate || this.endDate) {
      this.useraccountProvider.getUserCheckInLog(this.user.UserId, this.startDate, this.endDate).subscribe(res => {
        // debugger;
        console.log('viewlog from provider', res);
        this.total = 0;
        if (Array.isArray(res)) {
          this.viewLogList = res;

          this.viewLogList.forEach(element => {
            console.log('total', element.Total);
            if (element.Total > 0) {
              this.total += Number(element.Total);
            }
          });
        } else {
          this.viewLogList = [];
          this.total = 0;
        }
        console.log('viewlog', this.viewLogList);
        console.log('finaltotal', this.total);
      });
    }
  }

  goToViewDetail(data: ViewLog) {
    this.navCtrl.push('ViewlogdetailPage', { 'viewdata': data });
  }

  dateFormat(dateString: string) {
    // console.log('dateString', dateString);
    // dateString='2018-09-04 06:47:56 +0000';
    // console.log('momentdate',moment(dateString.substring(0, 19)).format("DD-MM-YYYY hh:mm a Z"));
    return moment(dateString.substring(0, 19).concat(" +0000")).local().format("DD MMM YYYY hh:mm a z");

  }

}
