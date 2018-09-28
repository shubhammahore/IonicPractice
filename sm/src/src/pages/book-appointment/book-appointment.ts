import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  TerminalDetail,
  TimeSlots,
  GetValueSlotData,
  Slot
} from '../../models/terminal';
import {
  TerminalProvider
} from '../../providers/terminal';
import * as moment from 'moment';
import {
  CommonProvider
} from '../../providers/common';
import {
  Platform
} from 'ionic-angular';
import {
  Device
} from '@ionic-native/device';
import {
  AlertProvider
} from '../../providers/alert';

import {
  PlaceOrder,
  DeviceInfo,
  SessionItem
} from '../../models/placeorder';
import {
  LoadingProvider
} from '../../providers/loading';
import * as _ from 'lodash';
import {
  AlertController,
  Navbar
} from 'ionic-angular';
import {
  Boolean
} from 'aws-sdk/clients/transcribeservice';
/**
 * Generated class for the BookAppointmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book-appointment',
  templateUrl: 'book-appointment.html',
})
export class BookAppointmentPage {
  @ViewChild('slides') slides: Slides;
  @ViewChild('slides1') slides1: Slides;
  terminal: TerminalDetail;
  slotsData: GetValueSlotData;
  currentIndex = 0;
  placeOrderModel: PlaceOrder = new PlaceOrder();
  slots = new TimeSlots();
  currentDate: any;
  deviceInfo = new DeviceInfo();
  sectionItemField = {
    items1: [],
    subtotal: 0,
    total: 0
  };
  formField = [];
  user: any;
  responseOrder = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private appState: AppStateProvider,
    private terminalProvider: TerminalProvider,
    private commonProvider: CommonProvider,
    public platform: Platform, private loadingProvider: LoadingProvider,
    private alertCtrl: AlertController) {
    this.terminal = this.appState.getTerminal();
    this.slotsData = new GetValueSlotData();
    this.slotsData.GroupId = this.terminal.ServiceGroups[0].Id;
    this.slotsData.SlotDate = this.terminal.TimeSlots[0].SlotDate;
    this.slotsData.FormId = this.terminal.Id;
    this.currentDate = moment().format("MM/DD/YYYY");
    this.user = this.appState.getUserProfile();
    this.getTimeSlots(this.terminal.Id, this.terminal.ServiceGroups[0].Id, this.terminal.TimeSlots[0].SlotDate);
    //<ion-col col-4 class="date-slot" [class.colorchange]="currentTime>slot.Time" [class.colorchange1]="currentTime<=slot.Time && slot.IsAvailable==false" [class.colorchange2]="currentTime<=slot.Time &&slot.IsAvailable==true">{{slot.Time}}</ion-col>
  }


  ionViewDidLoad() {



  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.user.UserRole == 'SM') {

      this.commonProvider.checkAvailGeoLocation();
    }

  }


  next() {
    this.slides.slideNext();
    let index = this.slides.getActiveIndex();
    this.slotsData.GroupId = this.terminal.ServiceGroups[index].Id;
    this.getTimeSlots(this.slotsData.FormId, this.slotsData.GroupId, this.slotsData.SlotDate);
  }

  prev() {
    this.slides.slidePrev();
    let index = this.slides.getActiveIndex();
    this.slotsData.GroupId = this.terminal.ServiceGroups[index].Id;
    this.getTimeSlots(this.slotsData.FormId, this.slotsData.GroupId, this.slotsData.SlotDate);

  }

  nextDoc() {
    this.slides1.slideNext();
    let index = this.slides1.getActiveIndex();
    this.slotsData.SlotDate = this.terminal.TimeSlots[index].SlotDate;
    this.getTimeSlots(this.slotsData.FormId, this.slotsData.GroupId, this.slotsData.SlotDate);
  }

  prevDoc() {
    this.slides1.slidePrev();
    let index = this.slides1.getActiveIndex();
    this.slotsData.SlotDate = this.terminal.TimeSlots[index].SlotDate;
    this.getTimeSlots(this.slotsData.FormId, this.slotsData.GroupId, this.slotsData.SlotDate);
  }

  getTimeSlots(FormId: string, GroupId: string, SlotDate: string) {
    this.loadingProvider.show('please wait...');
    this.currentDate = moment().format("MM/DD/YYYY");
    this.terminalProvider.getTimeSlots(FormId, GroupId, SlotDate).subscribe(res => {
      this.loadingProvider.hide();
      this.slots = res;
    })
  }

  bookDocAppoin(slot: Slot) {
    if (!this.loadingProvider.loading) {
      this.loadingProvider.show('please wait...');
    }
    this.placeOrderModel = this.commonProvider.getTerminalOrderDetail();
    this.deviceInfo = this.commonProvider.getDeviceInfo();
    this.sectionItemField = this.appState.getSessionItem();
    this.placeOrderModel.InfoArray.ProfileName = localStorage.getItem('ProfileName');
    let localthis = this;
    if (this.terminal.FT == 'AA') {
      _.forEach(localthis.sectionItemField.items1, function (item, index) {
        localthis.placeOrderModel.InfoArray[item.FN] = item.QTY.toString();
      })
      this.placeOrderModel.InfoArray.Total = this.sectionItemField.total.toString();
      this.placeOrderModel.InfoArray.totalItems = (this.sectionItemField.items1.length).toString();
    }
    this.placeOrderModel.InfoArray["Appointment Time"] = slot.Time;
    this.placeOrderModel.InfoArray["Appointment Date"] = this.slotsData.SlotDate;
    this.placeOrderModel.InfoArray["SlotId"] = slot.Id;
    this.placeOrderModel.InfoArray["AppointmentGroupId"] = this.slotsData.GroupId;
    this.placeOrderModel.InfoArray.CheckedIn = this.terminal.CheckedIn;


    if (this.platform.is('core')) {
      this.postOrder();
    } else {
      // this.postOrder();
      if (this.user.UserRole == 'SM')
      {
      this.commonProvider.getGeolocation().then(position => {

        if (position) {
          let pos: any = position;
          this.deviceInfo.Latitude = pos.coords.latitude.toString();
          this.deviceInfo.Longitude = pos.coords.longitude.toString();
        }
        this.postOrder();


      })
    }else{
      this.postOrder();
    }
  }

  }

  bookPopup(slot: Slot) {
    let isGreenValue = ((new Date().getTime() <= new Date(this.currentDate + ' ' + slot.Time).getTime()) && slot.IsAvailable);
    if (isGreenValue == true) {
      let alert = this.alertCtrl.create({

        subTitle: "Do yoy want to book an appointment at " + slot.Time,

        buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: data => {
              this.bookDocAppoin(slot);
            }
          }
        ]
      });
      alert.present();
    }
  }






  postOrder(): void {
    this.terminalProvider.getTransactionToken(this.terminal.WrioCode, this.user.UserId).subscribe(res => {
      this.placeOrderModel.TransactionToken = res;
      this.placeOrderModel.InfoArray.TransactionToken = res;
    this.placeOrderModel.InfoArray.Device_Stats = JSON.stringify(this.deviceInfo);
    this.terminalProvider.placeOrder(this.placeOrderModel).subscribe(res => {
      if (res) {
        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
        }

        let localthis = this;

        let orderDetail = {
          OrderId: 0,
          Amount: 0,
          AppointmentTime: '',
          AppointmentDate: ''
        }
        if (Array.isArray(res)) {

          _.forEach(res, function (data, index) {
            orderDetail.OrderId = data.TokenId;
            orderDetail.Amount = data.Total;
            localthis.responseOrder.push(orderDetail);
          })


        } else {
          orderDetail.OrderId = res.TokenId;
          orderDetail.Amount = res.Total;
          orderDetail.AppointmentTime = this.placeOrderModel.InfoArray["Appointment Time"];
          orderDetail.AppointmentDate = this.placeOrderModel.InfoArray["Appointment Date"];
          localthis.responseOrder.push(orderDetail);
        }





        this.navCtrl.push('OrderSuccessPage', {
          'orderDetail': this.responseOrder,
          'InfoArray': this.placeOrderModel.InfoArray
        });

      }

    }, err => {

      if (this.loadingProvider.loading) {
        this.loadingProvider.hide();
        this.loadingProvider.loading = null;
      }
    })
  })

  }

  getClassNameForSlot(value: any, IsAvailable: boolean): any {

    let newdate: Date = new Date();
    let concat: Date = new Date(this.currentDate + ' ' + value);
    let isGrayValue = newdate.getTime() >= concat.getTime();
    if (isGrayValue == true) {
      return 'gray';
    }


    let isRedValue = ((new Date().getTime() <= new Date(this.currentDate + ' ' + value).getTime()) && !IsAvailable);
    if (isRedValue == true) {
      return 'red';
    }

    let isGreenValue = ((new Date().getTime() <= new Date(this.currentDate + ' ' + value).getTime()) && IsAvailable);
    if (isGreenValue == true) {
      return 'green';
    }



  }


}
