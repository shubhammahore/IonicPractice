import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController
} from 'ionic-angular';
import {
  Platform
} from 'ionic-angular';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AlertProvider
} from '../../providers/alert';
import {
  DashboardPage
} from '../dashboard/dashboard';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  Device
} from '@ionic-native/device';
import {
  TerminalDetail
} from '../../models/terminal';
import {
  PlaceOrder,
  DeviceInfo,
  SessionItem
} from '../../models/placeorder';
import * as _ from 'lodash';
import {
  AppVersion
} from '@ionic-native/app-version';
import {
  TerminalProvider
} from '../../providers/terminal';
import {
  OrderSuccessPage
} from '../order-success/order-success';
import {
  BatteryStatus
} from '@ionic-native/battery-status';
import {
  Geolocation
} from '@ionic-native/geolocation';
import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {
  LoadingProvider
} from '../../providers/loading';
import {
  Diagnostic
} from '@ionic-native/diagnostic';
import * as moment from 'moment';
import {
  isObject
} from 'ionic-angular/util/util';
import {
  CommonProvider
} from '../../providers/common';
import {
  ProfilesProvider
} from '../../providers/profiles';
import {
  Profile
} from '../../models/profile';
import * as S3 from 'aws-sdk/clients/s3';
import {
  environment
} from './../../environments/environment';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import {
  Keyboard
} from '@ionic-native/keyboard';
import {
  FilePath
} from '@ionic-native/file-path';
import {
  FileChooser
} from '@ionic-native/file-chooser';
declare var window;

@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage implements OnInit {

  today = moment().format('DD MMM YYYY h:mm:ss a');

  terminal: TerminalDetail;
  userInfo: any;
  filename: any = null;
  uploadfilename: any = null;
  overlayHidden: boolean = true;
  overlayHiddenUpdate: boolean = true;
  deviceInfo = new DeviceInfo();
  formField = [];
  isKeyboardHide: boolean = true;
  sectionItemField = {
    items1: [],
    subtotal: 0,
    total: 0,
    Comment: ''
  };
  profileName: string = '';
  editUpdateProfile: string = '';
  checkedItems: boolean = false;
  checkedProfile: boolean = false;
  imgText: string = 'Select a Profile Picture';
  selectedImg: string = 'assets/icon/user.jpg';
  responseOrder = [];
  deleiveryCharge: number;
  placeOrderModel: PlaceOrder = new PlaceOrder();
  ProfileId: any;
  profileData: any;
  awsFilePath: any;
  todayfiletime = new Date().getTime();
  todayfiledate = moment().format('YYYY-MM-DD');
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    private appState: AppStateProvider,
    private device: Device, private appVersion: AppVersion,
    private terminalProvider: TerminalProvider,
    private batteryStatus: BatteryStatus,
    private loadingProvider: LoadingProvider,
    private geolocation: Geolocation,
    public platform: Platform,
    private keyboard: Keyboard,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private diagnostic: Diagnostic,
    private commonProvider: CommonProvider,
    private profilesProvider: ProfilesProvider,
    public actionSheetCtrl: ActionSheetController, private camera: Camera) {
    this.ProfileId = localStorage.getItem('ProfileId');
    this.getFields();

    this.userInfo = this.appState.getUserProfile();
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
    });
    // this.profileData=this.profilesProvider.getProfilelocal(this.ProfileId);


  }


  ngOnInit() {
    if (this.userInfo.UserRole == 'SM') {

      this.commonProvider.checkAvailGeoLocation();
    }

  }


  ionViewDidLoad() {
    this.userInfo = this.appState.getUserProfile();

  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (this.terminal.FT == 'CO' || (this.terminal.FT == 'ER' && this.sectionItemField == null)) {
        this.placeOrder();
        this.getProfile();
      }
    }, 1000)

  }

  getFields(): void {
    this.formField = this.appState.getFormField();
    this.awsFilePath = JSON.parse(localStorage.getItem('AwsFilePath'));
    this.terminal = this.appState.getTerminal();
    if (this.terminal.FT !== 'CO') {
      this.sectionItemField = this.appState.getSessionItem();

      if (this.terminal.DeliveryCharges > 0) {
        this.sectionItemField.subtotal = this.sectionItemField.total;
        this.sectionItemField.total = this.sectionItemField.subtotal + this.terminal.DeliveryCharges;
      }
    }

  }


  showOverlay() {

    this.ngZone.run(() => {
      if ((this.profileData && this.profileData.IsDefault == 'YES') || this.ProfileId == null || this.ProfileId == '0' || this.ProfileId == '-1') {
        this.overlayHidden = false;
      } else {
        this.overlayHiddenUpdate = false;
      }
    })
  }



  closeOverlay() {
    this.checkedItems = false;
    this.checkedProfile = false;
    this.profileName = ''
    this.selectedImg = 'assets/icon/user.jpg';
    this.imgText = 'Select a Profile Picture';
    this.overlayHidden = true;
  }

  closeUpdateOverlay() {
    this.overlayHiddenUpdate = true;
  }

  /**
   * This method is used to fill all terminal and app info for ordering a perticular terminal
   */
  placeOrder(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      if (!this.loadingProvider.loading) {
        this.loadingProvider.show('please wait...');
      }

      this.placeOrderModel = this.commonProvider.getTerminalOrderDetail();
      this.deviceInfo = this.commonProvider.getDeviceInfo();
      if (this.terminal.FT !== 'CO') {
        this.placeOrderModel.InfoArray.ProfileName = localStorage.getItem('ProfileName');
      }

      let localthis = this;
      if ((this.terminal.FT !== 'ER' && this.terminal.FT !== 'CO') || (this.terminal.FT == 'ER' && this.sectionItemField)) {
        _.forEach(localthis.sectionItemField.items1, function (item, index) {
          localthis.placeOrderModel.InfoArray[item.FN] = item.QTY.toString();
        })
      }
      if ((this.terminal.FT !== 'CO' && this.terminal.FT !== 'ER') || (this.terminal.FT == 'ER' && this.sectionItemField)) {
        _.forEach(localthis.sectionItemField.items1, function (item, index) {
          localthis.placeOrderModel.InfoArray[item.FN] = item.QTY.toString();
          let tempitem = new SessionItem();
          tempitem.FId = item.Id;
          tempitem.Fname = item.FN;
          tempitem.price = item.Price.toString();
          tempitem.Qty = item.QTY.toString();
          tempitem.section_Email = item.section_Email;
          tempitem.section_Id = item.section_Id;
          tempitem.itemTag = item.Tag;
          if (item.Note != '') {
            tempitem.notes = item.Note;
          }
          localthis.placeOrderModel.InfoArray.ItemsArray.push(tempitem);

        })
        if (this.terminal.FT !== 'CO') {
          if (this.terminal.DeliveryCharges > 0) {
            this.placeOrderModel.InfoArray["Delivery Charges"] = this.terminal.DeliveryCharges;
            this.placeOrderModel.InfoArray.Total = this.sectionItemField.total.toString();
          } else {
            this.placeOrderModel.InfoArray.Total = this.sectionItemField.total.toString();
          }
          this.placeOrderModel.InfoArray.totalItems = (this.sectionItemField.items1.length).toString();
        }
      }

      this.placeOrderModel.InfoArray.CheckedIn = this.terminal.CheckedIn;

      if (this.platform.is('core')) {
        this.postOrder();
      } else {
        if (this.userInfo.UserRole == 'SM')
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
  }


  /**
   * this methos is used to post perticuler terminal order 
   * @returns void
   */
  postOrder(): void {
    this.terminalProvider.getTransactionToken(this.terminal.WrioCode, this.userInfo.UserId).subscribe(res => {
      this.placeOrderModel.TransactionToken = res;
      this.placeOrderModel.InfoArray.TransactionToken = res;
    this.placeOrderModel.InfoArray.Device_Stats = JSON.stringify(this.deviceInfo);
    this.terminalProvider.placeOrder(this.placeOrderModel).subscribe(res => {
      if (res) {
        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
        }
        if (this.terminal.FT == 'CO') {
          this.getProfile();
        }
        if (this.terminal.FT != 'CO' && this.sectionItemField) {
          let localthis = this;


          if (Array.isArray(res)) {

            _.forEach(res, function (data, index) {
              let orderDetail = {
                OrderId: 0,
                Name: '',
                Amount: 0,
                LogId: '',
                UserId: 0
              }
              orderDetail.OrderId = data.TokenId;
              orderDetail.Name = data.TerminalName;
              orderDetail.Amount = data.Total;

              orderDetail.LogId = data._id.$id;

              orderDetail.UserId = data.UserId;
              localthis.responseOrder.push(orderDetail);
            })


          } else {
            let orderDetail = {
              OrderId: 0,
              Name: '',
              Amount: 0,
              LogId: '',
              UserId: 0
            }
            orderDetail.OrderId = res.TokenId;
            orderDetail.Name = res.TerminalName;
            orderDetail.Amount = res.Total;

            orderDetail.LogId = res._id.$id;

            orderDetail.UserId = res.UserId;
            localthis.responseOrder.push(orderDetail);
          }



          if (this.terminal.Pay == 'Y') {

            this.navCtrl.push('PaymentGatewayPage', {
              'orderDetail': this.responseOrder,
              'InfoArray': this.placeOrderModel.InfoArray
            });

          } else {
            // this.appState.deleteTerminal();
            this.navCtrl.push('OrderSuccessPage', {
              'orderDetail': this.responseOrder,
              'InfoArray': this.placeOrderModel.InfoArray
            });
          }
        }
      }
    }, err => {

      if (this.loadingProvider.loading) {
        this.loadingProvider.hide();
        this.loadingProvider.loading = null;
      }
    })

  })
  }

  navigateToDashboard(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.appState.deleteTerminal();
      this.navCtrl.popToRoot();
    }
  }


  // code for Profile implementation



  getfilename(filestring) {
    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    return file;
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
  }

  takePicture(sourceType: number): void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.selectedImg = imageData;
      this.imgText = 'Profile Picture is Selected';
      this.filename = this.getfilename(imageData);
      let fileext = this.getfileext(imageData);
      let file;
      if (fileext == "jpeg" || fileext == "png" || fileext == "jpg" || fileext == "gif") {
        this.readimage(imageData, fileext, `application/${fileext}`).then((fileblob) => {
          file = {
            blob: fileblob,
            type: `application/${fileext}`,
            fileext: fileext,
            filename: this.filename
          }
          this.uploadfile(file)
        })
      }
    }, (err) => {

      // Handle error
    });
  }

  uploadfile(file: any): void {

    const bucket = new S3({
      accessKeyId: environment.amazonS3AccessKeyId,
      secretAccessKey: environment.amazonS3SecretAccessKey,
      region: environment.amazonS3Region
    });
    const params = {
      Bucket: environment.amazonS3Bucket,
      Key: `FileAttachements/${this.terminal.TerminalId}/${this.todayfiledate}/file_${this.todayfiletime}.${file.fileext}`,
      ContentType: file.type,
      ACL: 'public-read',
      ContentDisposition: 'inline',
      ContentLength: file.size,
      Body: file.blob
    };

    let localThis = this;

    bucket.upload(params, function (err, data) {
      if (err) {
        return false;
      }
      localThis.uploadfilename = data.Location;
      return true;
    });
  }

  readimage(_imagePath, name, type) {

    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], {
              type: type
            });
            imgBlob.name = name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }


  takePictureOptions(): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Take Picture Form',
      buttons: [{
          text: 'Camera',
          icon: 'camera',
          role: 'destructive',
          handler: () => {
            this.takePicture(1);
          }
        },
        {
          text: 'Device',
          icon: 'phone-portrait',
          role: 'destructive',
          handler: () => {
            this.filechooes();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }



  filechooes() {
    this.fileChooser.open().then(uri => {
        let file;
        this.filePath.resolveNativePath(uri).then((fileentry) => {
          this.loadingProvider.show('please wait...');
          this.filename = this.getfilename(fileentry);
          let fileext = this.getfileext(fileentry);

          if (fileext == "pdf") {
            this.readimage(fileentry, fileext, "application/pdf").then((fileblob) => {
              file = {
                blob: fileblob,
                type: "application/pdf",
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file);
            })
          }
          if (fileext == "docx") {
            this.readimage(fileentry, fileext, "application/vnd.openxmlformats-officedocument.wordprocessingml.document").then((fileblob) => {
              file = {
                blob: fileblob,
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file);
            })
          }
          if (fileext == "doc") {
            this.readimage(fileentry, fileext, "application/msword").then((fileblob) => {
              file = {
                blob: fileblob,
                type: "application/msword",
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file)
            })
          }
          if (fileext == "epub") {
            this.readimage(fileentry, fileext, "application/octet-stream").then((fileblob) => {
              file = {
                blob: fileblob,
                type: "application/octet-stream",
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file)
            })
          }
          if (fileext == "accdb") {
            this.readimage(fileentry, fileext, "application/msaccess").then((fileblob) => {
              file = {
                blob: fileblob,
                type: "application/msaccess",
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file)
            })
          }
          if (fileext == "xlsx") {
            this.readimage(fileentry, fileext, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then((fileblob) => {
              file = {
                blob: fileblob,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file);
            })
          }
          if (fileext == "jpeg" || fileext == "png" || fileext == "jpg" || fileext == "gif") {
            this.readimage(fileentry, fileext, `application/${fileext}`).then((fileblob) => {
              file = {
                blob: fileblob,
                type: `application/${fileext}`,
                fileext: fileext,
                filename: this.filename
              }
              this.uploadfile(file)
            })
          }
        });
      })
      .catch(e => console.log(e));
  }

  removeImage() {
    this.selectedImg = 'assets/icon/user.jpg';
    this.imgText = 'Select a Profile Picture';
  }




  async getProfile() {

    if (this.ProfileId && this.ProfileId !== '-1') {
      await this.profilesProvider.getProfilelocal(this.ProfileId).then(res => {
        this.profileData = res
        if (this.profileData && this.profileData.IsDefault == 'YES') {
          this.updateProfile();
        }

      });
    } else if (this.ProfileId == null || this.ProfileId == '-1') {
      this.saveProfile();
    }
  }

  saveProfile() {

    this.ProfileId = localStorage.getItem('ProfileId');
    this.profilesProvider.getProfileLocalByName(this.profileName).then(res => {
      if (res == true) {

        this.alertProvider.ProfileNameAlert();
      } else {

        if (this.ProfileId == null || this.ProfileId == '-1') {
          this.placeOrderModel.InfoArray.Image = "https://s3.amazonaws.com/mwrio/UserAccountPicture/Wrio_client_logo.png";
          this.placeOrderModel.InfoArray.ProfileName = 'My Wrio Profile';

        } else {

          this.placeOrderModel.InfoArray.Image = (this.uploadfilename) ? this.uploadfilename : "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
          this.placeOrderModel.InfoArray.ProfileName = this.profileName;
        }
        delete this.placeOrderModel.InfoArray['DeviceARN'];
        delete this.placeOrderModel.InfoArray['Device_Stats'];
        delete this.placeOrderModel.InfoArray['ItemsArray'];
        delete this.placeOrderModel.InfoArray['Total'];
        delete this.placeOrderModel.InfoArray['TransactionToken'];
        this.profilesProvider.Post(this.placeOrderModel.InfoArray).subscribe(res => {
          if (res) {
            let profile = new Profile();
            profile.ProfileId = res._id.$id;
            profile.Image = res.Image;
            //profile.Image=(this.uploadfilename)?this.uploadfilename:"https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
            profile.IsDefault = res.Default;
            profile.ProfileName = res.ProfileName;
            delete res['DeviceARN'];
            delete res['Device_Stats'];
            delete res['ItemsArray'];
            delete res['Total'];
            delete res['TransactionToken'];
            profile.Data = res;

            this.profilesProvider.saveProfileLocal(profile);
            this.overlayHidden = true;
            this.profileName = '';
            this.profileData = [];
            if (this.ProfileId && this.ProfileId !== '-1') {
              this.alertProvider.showSucessProfile('Profile Save Successfully!!');
            }
            if (this.ProfileId == null || this.ProfileId == '-1') {
              localStorage.setItem('ProfileId', profile.ProfileId);
              this.ProfileId = profile.ProfileId;

              this.getProfile();
            }
          }
        })



      }
    })

  }



  updateProfile() {

    delete this.placeOrderModel.InfoArray['DeviceARN'];
    delete this.placeOrderModel.InfoArray['Device_Stats'];
    delete this.placeOrderModel.InfoArray['ItemsArray'];
    delete this.placeOrderModel.InfoArray['Total'];
    delete this.placeOrderModel.InfoArray['TransactionToken'];
    if (this.profileData && this.profileData.IsDefault == 'YES') {
      this.placeOrderModel.InfoArray.Image = "https://s3.amazonaws.com/mwrio/UserAccountPicture/Wrio_client_logo.png";

    } else {
      this.placeOrderModel.InfoArray.Image = (this.uploadfilename) ? this.uploadfilename : "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
    }
    this.profilesProvider.update(this.placeOrderModel.InfoArray, this.profileData.ProfileId, this.placeOrderModel.InfoArray.UserId).subscribe(res => {
      if (res) {
        delete res['DeviceARN'];
        delete res['Device_Stats'];
        delete res['ItemsArray'];
        delete res['Total'];
        delete res['TransactionToken'];
        this.profileData.Data = res;
        this.profilesProvider.updateProfileLocal(this.profileData);
        this.overlayHiddenUpdate = true;
        if (this.profileData && this.profileData.IsDefault == 'NO') {
          this.alertProvider.showSucessProfile('Profile Update Successfully!!');
        }


      }
    })

  }

  showSaveUpdate() {
    if (this.editUpdateProfile == 'newProfile') {
      this.overlayHiddenUpdate = true;
      this.overlayHidden = false;
    } else if (this.editUpdateProfile == 'updateProfile') {
      this.updateProfile();
    }
  }




}
