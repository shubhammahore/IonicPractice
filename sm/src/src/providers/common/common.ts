import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Diagnostic
} from '@ionic-native/diagnostic';
import {
  AlertController
} from 'ionic-angular';
import {
  PlaceOrder,
  DeviceInfo,
  SessionItem
} from '../../models/placeorder';
import {
  TerminalDetail
} from '../../models/terminal';
import * as moment from 'moment';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  Device
} from '@ionic-native/device';
import {
  TerminalProvider
} from '../../providers/terminal';
import * as _ from 'lodash';
/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonProvider {
  today = moment().format('DD MMM YYYY h:mm:ss a');
  placeOrderModel: PlaceOrder = new PlaceOrder();
  terminal: TerminalDetail;
  userInfo: any;
  awsFilePath: any;
  deviceInfo = new DeviceInfo();
  constructor(public http: HttpClient, private diagnostic: Diagnostic,
    private alertCtrl: AlertController,
    private appState: AppStateProvider,
    public connectivityProvider: ConnectivityProvider,
    private device: Device, private terminalProvider: TerminalProvider, ) {

  }


  checkAvailGeoLocation() {
    let successCallback = (isAvailable) => {

      if (!isAvailable) {
        this.openSettingLocation();
      }
    };
    let errorCallback = (e) => console.error(e);

    this.diagnostic.isGpsLocationEnabled().then(successCallback).catch(errorCallback);

  }




  openSettingLocation() {
    const prompt = this.alertCtrl.create({

      message: "If you want to place order please enable your location. Do you want to enable location?",
      buttons: [{
          text: 'CANCEL',
          handler: data => {

          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.diagnostic.switchToLocationSettings();
          }
        }
      ]
    });
    prompt.present();
  }

  getTerminalOrderDetail() {
    let formField = [];
    this.awsFilePath = JSON.parse(localStorage.getItem('AwsFilePath'));
    this.terminal = new TerminalDetail();
    this.placeOrderModel = new PlaceOrder();

    this.terminal = this.appState.getTerminal();
    this.userInfo = this.appState.getUserProfile();
    formField = this.appState.getFormField();
    this.placeOrderModel.AccountId = this.terminal.AccountId;
    this.placeOrderModel.SessionId = this.terminal.SessionId;
    this.placeOrderModel.FormType = this.terminal.FT;
    this.placeOrderModel.PaymentPaypal = 'Y';
    this.placeOrderModel.PaymentMethod = '';
    this.placeOrderModel.IsPayment = this.terminal.Pay;
    this.placeOrderModel.NotiFlag = 'N';
    this.placeOrderModel.isRemoteCheckIn = 'Y';
    this.placeOrderModel.InfoArray.FormId = this.terminal.Id;
    this.placeOrderModel.InfoArray.UserId = this.userInfo.UserId.toString();
    this.placeOrderModel.InfoArray.TerminalId = this.terminal.TerminalId.toString();
    this.placeOrderModel.InfoArray.TerminalName = this.terminal.TerminalName;
    // this.placeOrderModel.InfoArray.Image = this.userInfo.Image;
    this.placeOrderModel.InfoArray.Image = "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
    this.placeOrderModel.InfoArray.TerminalImage = this.terminal.Image;
    this.placeOrderModel.InfoArray.DeviceARN = this.appState.getFCMToken();
    this.placeOrderModel.InfoArray.UserDeviceId = this.device.uuid;
    this.placeOrderModel.InfoArray["Check In Time"] = moment(this.today).utc().format('YYYY-MM-DD HH:mm:ss 0000');

    this.placeOrderModel.InfoArray.OS = 'android';

    let localthis = this;

    _.forEach(formField, function (data, index) {
      if (data.value) {
        localthis.placeOrderModel.InfoArray[data.key] = data.value.toString();
      }
      if (data.isFile == true) {

        if (localthis.awsFilePath) {

          localthis.placeOrderModel.InfoArray[data.key] = localthis.awsFilePath.toString();
        }
      }



    })
    return this.placeOrderModel;
  }


  getDeviceInfo() {
    this.deviceInfo = new DeviceInfo();

    this.deviceInfo.Network_Type = this.connectivityProvider.network.type;
    if (this.connectivityProvider.network.type == 'wifi') {
      this.deviceInfo.Network_Wifi = 'true';
    } else {
      this.deviceInfo.Network_Wifi = 'false';
    }

    this.deviceInfo.Android_OS = '6.0';
    this.deviceInfo.Network_Class = this.connectivityProvider.network.type;
    this.deviceInfo.App_ver_Code = '50';
    this.deviceInfo.Device_Details = this.device.model;
    this.deviceInfo.App_Version = localStorage.getItem('AppVersion');
    this.deviceInfo.App_Name = localStorage.getItem('AppName');
    if (this.device.version) {
      this.deviceInfo.DeviceSDK = this.device.version.toString();
    }
    return this.deviceInfo;
  }


  getGeolocation() {

    let localthis = this;
    return new Promise((resolve, reject) => {

      function success(position) {
        resolve(position);

      };

      function error(err) {
        // alert('ERROR(' + err.code + '): ' + err.message);
        resolve();
      };
      if (navigator.geolocation) {

        var options = {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 3000
        };


        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        resolve(null);
      }
    })
  }
}