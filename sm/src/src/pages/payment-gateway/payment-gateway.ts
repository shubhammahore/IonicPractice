import {
  AlertProvider
} from './../../providers/alert/alert';
import {
  ConnectivityProvider
} from './../../providers/connectivity/connectivity';
import {
  environment
} from './../../environments/environment';
import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  PaymentProvider
} from '../../providers/payment'
import {
  UpdatePayment,
  PaymentOption
} from '../../models/placeorder';
import {
  TerminalDetail
} from '../../models/terminal'
import * as _ from 'lodash';
import {
  AlertController,
  Navbar
} from 'ionic-angular';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser';
import {
  AppStateProvider
} from '../../providers/app-state';

/**
 * Generated class for the PaymentGatewayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-gateway',
  templateUrl: 'payment-gateway.html',
})
export class PaymentGatewayPage {
  @ViewChild('navbar') navBar: Navbar;
  orderData = [];
  infoArray: any;
  paymentOpt: Array < PaymentOption >= [];
  terminal: TerminalDetail;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, public paymentProvider: PaymentProvider,
    private alertCtrl: AlertController, private inAppBrowser: InAppBrowser, public alertProvider: AlertProvider, public connectivityProvider: ConnectivityProvider, private appState: AppStateProvider) {
    this.orderData = this.navParams.get('orderDetail');
    this.infoArray = this.navParams.get('InfoArray');
    this.terminal = this.appState.getTerminal();
  }

  ionViewDidLoad() {

    this.paymentOption();
    this.navBar.backButtonClick = () => {
      ///here you can do wathever you want to replace the backbutton event
      this.goBackConfirm();
    };
  }

  ionViewDidEnter() {
    localStorage.setItem('PageName', 'PaymentGateWay');
  }

  paymentOption(): any {
    this.paymentProvider.paymentOption(this.terminal.TerminalId).subscribe(res => {

      this.paymentOpt = res;
      let localthis = this;
      _.forEach(localthis.paymentOpt, function (data) {
        if (data.PaymentMethod == 'COD') {
          data.PaymentName = 'CASH ON Delivery (COD)';
        } else if (data.PaymentMethod == 'PI') {
          data.PaymentName = 'Payment Instruction'

        } else {
          data.PaymentName = data.PaymentMethod;
        }
      })

    })
  }

  goBackConfirm() {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      let confirm = false;
      let alert = this.alertCtrl.create({

        subTitle: "Do you want to cancel this order and go back?",

        buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: data => {
              confirm = true;
            }
          }
        ]
      });
      alert.present();
      alert.onDidDismiss(() => {
        if (confirm) {
          localStorage.removeItem('PageName');
          this.navCtrl.popToRoot();
        }
      })
    }
  }

  updatePayment(paymentMethod: string): any {
    let updatePaymethodModel: UpdatePayment;
    let localthis = this;
    _.forEach(localthis.orderData, function (data) {
      updatePaymethodModel = new UpdatePayment();
      updatePaymethodModel.WrioCode = localthis.terminal.WrioCode;
      updatePaymethodModel.LogId = data.LogId;
      updatePaymethodModel.PaymentMethod = paymentMethod;
      updatePaymethodModel.TokenId = data.OrderId;
      localthis.paymentProvider.update(updatePaymethodModel).subscribe(res => {

        if (res) {
          localthis.navCtrl.push('OrderSuccessPage', {
            'orderDetail': localthis.orderData,
            'InfoArray': localthis.infoArray
          });
        }
      })
    })



  }


  showMessage(paymentOption: PaymentOption) {
    if (paymentOption.PaymentMethod != 'PayU Money') {
      let title: any;
      if (paymentOption.PaymentMethod == 'COD') {
        title = "Cash On Delivery Message";
      } else if (paymentOption.PaymentMethod == 'PI') {
        title = "Payment Instruction";
      }
      let alert = this.alertCtrl.create({

        subTitle: paymentOption.Message,
        title: title,
        buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: data => {
              this.updatePayment(paymentOption.PaymentMethod);
            }
          }
        ]
      });
      alert.present();

    } else {

      this.payuMoneyPayment(paymentOption.PaymentMethod, paymentOption.Key1);

    }
  }
  payuMoneyPayment(paymentMethod: string, Key: string) {
    let txnid = this.terminal.WrioCode + '_' + this.terminal.TransactionToken; //wrio code_tokentoken
    let udf2 = this.orderData[0].LogId;
    let udf4 = this.terminal.WrioCode; //wrio code

    let browser = this.inAppBrowser.create(
      `http://devapi.checkmeinweb.com/APIv2/PayUBiz/payuform.php?amount=${this.orderData[0].Amount}&key=${Key}&txnid=${txnid}&productinfo=${environment.productinfo}&udf1=${this.orderData[0].UserId}&udf2=${udf2}&udf3=${this.terminal.CN}&udf4=${udf4}&udf5=${txnid}&surl=${environment.mainUrl}&furl=${environment.mainUrl}&curl=${environment.mainUrl}&pg=${environment.pg}&firstname=${environment.firstname}&email=${environment.email}&phone=${environment.phone}`,
      '_blank',
      'location=no'
    );
    browser.on('loadstop').subscribe((ev) => {
      browser.executeScript({
        code: 'document.documentElement.innerHTML;'
      }).then(
        (htmldata) => {
          localStorage.setItem("payuresponse", htmldata);

        }
      ).then(data => {
        let parser = new DOMParser();
        let doc: any = parser.parseFromString((localStorage.getItem("payuresponse")), "text/html");

        if (doc.getElementsByTagName('h3')[0].innerText) {
          doc = doc.getElementsByTagName('h3')[0].innerText;
          if ((ev.url === 'http://devapi.checkmeinweb.com/API/PayUBiz/response.php') && (doc.includes('Your order status is success'))) {
            this.updatePayment(paymentMethod);
            browser.close();

          } else if ((ev.url === 'http://devapi.checkmeinweb.com/API/PayUBiz/response.php') && (doc.includes('Your order status is failure'))) {
            this.navCtrl.push('OrderSuccessPage', {
              'orderDetail': null,
              'InfoArray': null
            });
            browser.close();
            // alert('Payment failure!');
          }
        }
      });

    })
  }
}
