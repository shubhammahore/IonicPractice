import {
  LoginPage
} from './../login/login';
import {
  Component,
  NgZone,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef

} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController
} from 'ionic-angular';
import {
  AppStateProvider
} from '../../providers/app-state'
import {
  Geolocation
} from '@ionic-native/geolocation';
import {
  FormBase,
  TextboxForm,
  DropdownForm,
  DateTimeForm,
  CheckBoxForm,
  ToggleForm,
  FileForm
} from '../../models/form';
import {
  FormGroup
} from '@angular/forms';
import {
  FormControlProvider
} from '../../providers/form-control';
import {
  TerminalDetail,
  FormField,
  Value
} from '../../models/terminal';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AlertProvider
} from '../../providers/alert';
import {
  AlertController
} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  Keyboard
} from '@ionic-native/keyboard';
import {
  Platform
} from 'ionic-angular';
import {
  PlaceOrder,
  DeviceInfo,
  SessionItem
} from '../../models/placeorder';
import {
  LoadingProvider
} from '../../providers/loading';
import {
  Device
} from '@ionic-native/device';
declare var window;
import {
  Diagnostic
} from '@ionic-native/diagnostic';
import {
  FileChooser
} from '@ionic-native/file-chooser';
import {
  TerminalProvider
} from '../../providers/terminal';
import {
  SQLite,
  SQLiteObject
} from '@ionic-native/sqlite';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import {
  File
} from '@ionic-native/file';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import {
  environment
} from '../../environments/environment';
import {
  FilePath
} from '@ionic-native/file-path';
import {
  CommonProvider
} from '../../providers/common';
import {
  Profile
} from '../../models/profile';
import {
  THIS_EXPR
} from '@angular/compiler/src/output/output_ast';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-order-form',
  templateUrl: 'order-form.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class OrderFormPage implements OnInit {


  mainprofile: Array < Profile >= [];
  filtermainprofile: Array < Profile >= [];
  terminal: TerminalDetail;
  prof: Profile;
  terminalFormFields: FormBase < any > [] = [];
  form: FormGroup;
  payLoad = '';
  isFilter = false;
  // data: any = '+91';
  number: any = null;
  isKeyboardHide: boolean = true;
  SelectedDate: any;
  marknoOrder: boolean;
  user: any;
  filterValueModel = "showAll";
  sortValueModel = "showAll";
  overlayHidden: boolean = true;
  overlayHideFilter: boolean = true;
  deviceInfo = new DeviceInfo();
  placeOrderModel: PlaceOrder = new PlaceOrder();
  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  filename: any = null;
  fileExtention: any;
  uploadfilename: any = null;
  profileId = '';
  selectedImage: any;
  filterValueArry: Array < any >= [];
  filterProfiles: Array < any >= [];
  displayFilterVal = '';
  isDisplay = false;
  displayProfileName = 'Select Profile';
  todayfiletime = new Date().getTime();
  todayfiledate = moment().format('YYYY-MM-DD');
  today = moment().format('DD MMM YYYY h:mm:ss a');
  sortIcon = 'md-arrow-down';
  source: any;
  destination: any;
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array < string > = ['Backspace', 'Tab', 'End', 'Home', '-'];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private appState: AppStateProvider,
    public alertProvider: AlertProvider,
    private formControlProvider: FormControlProvider,
    private ngZone: NgZone,
    private keyboard: Keyboard,
    public connectivityProvider: ConnectivityProvider,
    private loadingProvider: LoadingProvider, private device: Device,
    private geolocation: Geolocation,
    public platform: Platform,
    private terminalProvider: TerminalProvider,
    private diagnostic: Diagnostic,
    private cdRef: ChangeDetectorRef,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private fileChooser: FileChooser, private file: File,
    private commonProvider: CommonProvider, private sqlite: SQLite) {

    this.terminal = this.appState.getTerminal();
    this.getProfile();

    this.SelectedDate = '';
    this.marknoOrder = this.navParams.get('MarkNoOrder');
    this.user = this.appState.getUserProfile();
    this.keyboard.disableScroll(true);
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
    });

    if (this.platform.isPlatformMatch('android')) {
      // This will only print when on iOS
      this.source = cordova.file.applicationDirectory + 'www/assets/data/';
      this.destination = cordova.file.externalRootDirectory;
    }
  }

  ionViewDidLoad() {


    this.terminalProvider.getTransactionToken(this.terminal.WrioCode, this.user.UserId).subscribe(res => {

      this.placeOrderModel.TransactionToken = res;
      this.placeOrderModel.InfoArray.TransactionToken = res;
    })
  }

  ionViewCanLeave(): boolean {
    if (!this.overlayHidden || !this.overlayHideFilter) {
      this.overlayHideFilter = true;
      this.overlayHidden = true;
      return false
    } else {
      return true
    }
  }
  /**
   * this method used for creating form fields
   * @returns void
   */

  ngOnInit() {

    if (this.user.UserRole == 'SM') {

      this.commonProvider.checkAvailGeoLocation();
    }

  }

  getProfile() {
    this.mainprofile = [];
    this.sqlite.create({
        name: 'ProfileDb.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql('select * from Profiles', []).then((data) => {
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              let profileData = new Profile();
              profileData.Id = data.rows.item(i).id;
              profileData.IsDefault = data.rows.item(i).Isdefault;
              profileData.ProfileId = data.rows.item(i).ProfileId;
              profileData.Data = data.rows.item(i).Data;
              profileData.ProfileName = data.rows.item(i).ProfileName;
              profileData.Image = data.rows.item(i).Image;
              this.mainprofile.push(profileData);

              let localthis = this;
              this.mainprofile = _.sortBy(localthis.mainprofile, 'Id');
            }
            this.filtermainprofile = this.mainprofile;
          }


          this.getFormFields();

        }, (err) => {
          this.getFormFields();

        });
      })

  }


  /**
   * this method is used to generate dynamic form collection for perticular terminal
   * @returns void
   */
  getFormFields(): void {



    _.forEach(this.terminal.FormField, (value: FormField) => {

      if (value.DT === 'T' || value.DT === 'N' || value.DT === 'I') {
        const textBox = new TextboxForm();
        // textBox.key = value.FN.replace(/ +/g, "");
        textBox.key = value.FN;
        textBox.label = value.FN;
        textBox.isCheck = value.DT;
        textBox.KT = value.KT;
        textBox.value = '';
        textBox.required = (value.M === 'Y') ? true : false;
        textBox.type = (value.KT === 'T') ? 'text' : (value.KT === 'E') ? 'email' : (value.KT === 'P') ? 'tel' : 'number';
        textBox.order = value.SQ;
        if (value.KT === 'E') {
          textBox.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
        }
        if (value.KT === 'P') {
          textBox.pattern = "^[\+0-9]{1,13}$";
        }

        this.terminalFormFields.push(textBox);

      }

      if (value.DT === 'DD') {
        const dropdown = new DropdownForm();
        dropdown.key = value.FN;
        dropdown.label = value.FN;
        dropdown.isCheck = value.DT;
        dropdown.options = value.Values;
        dropdown.order = value.SQ;
        dropdown.required = (value.M === 'Y') ? true : false;
        this.terminalFormFields.push(dropdown);
      }

      if (value.DT === 'D') {
        const datetime = new DateTimeForm();

        datetime.key = value.FN;
        datetime.isCheck = value.DT;
        datetime.label = value.FN;
        datetime.order = value.SQ;
        datetime.required = (value.M === 'Y') ? true : false;
        this.terminalFormFields.push(datetime);
      }

      if (value.DT === 'CK') {

        const checkbox = new CheckBoxForm();

        checkbox.key = value.FN;
        checkbox.value = 'false';
        checkbox.isCheck = value.DT;
        checkbox.label = value.FN;
        checkbox.order = value.SQ;
        checkbox.required = (value.M === 'Y') ? true : false;
        this.terminalFormFields.push(checkbox);

      }
      if (value.DT === 'SW') {

        const toggle = new ToggleForm();

        toggle.key = value.FN;
        toggle.value = 'false';
        toggle.isCheck = value.DT;
        toggle.label = value.FN;
        toggle.order = value.SQ;
        toggle.required = (value.M === 'Y') ? true : false;
        this.terminalFormFields.push(toggle);

      }
      if (value.DT === 'FA') {

        const file = new FileForm();
        file.KT = value.DT;
        file.order = value.SQ;
        file.formName = value.FN;
        file.required = (value.M === 'Y') ? true : false;

        this.terminalFormFields.push(file);

      }


    });
    let localthis = this;

    if (this.mainprofile.length > 0) {
      this.prof = new Profile();
      this.prof = _.find(localthis.mainprofile, function (o) {
        return o.IsDefault == 'YES'

      });
      this.getFormFiledPopulate(this.prof.Id);
    } else {
      this.prof = new Profile();
      this.form = this.formControlProvider.toFormGroup(this.terminalFormFields);
      this.prof.ProfileName = 'Select Profile';
      this.prof.Image = "assets/icon/user.jpg";
    }

    this.isDisplay = true;
  }

  getFormFiledPopulate(Id: number) {
    // this.isDisplay=false;
    localStorage.removeItem('ProfileId');
    localStorage.removeItem('ProfileName');

    if (Id !== 0) {

      this.prof = new Profile();
      this.prof = this.mainprofile.find(obj => obj.Id == Id);

      localStorage.setItem('ProfileId', this.prof.ProfileId);
      localStorage.setItem('ProfileName', this.prof.ProfileName);

      let localthis = this;

      _.forEach(localthis.terminalFormFields, function (formfields, index) {
        formfields.value = '';
        if (formfields.isCheck === 'SW' || formfields.isCheck === 'CK') {
          formfields.value = 'false';
        }
        let profileDetail = JSON.parse(localthis.prof.Data);
        let value = _.get(profileDetail, formfields.key);
        if (value) {
          formfields.value = (formfields.KT === 'P') ? '+' + Number(value.replace(/ +/g, "")) : value;
          if (formfields.KT === 'P') {
            localthis.number = formfields.value;


          }


          if (formfields.isCheck === 'D') {
            let localdate = moment(value).format("YYYY-MM-DD") + "T00:00:00.000Z";
            formfields.value = localdate;
            localthis.SelectedDate = formfields.value;
          }
          if (formfields.isCheck === 'SW' || formfields.isCheck === 'CK') {
            formfields.value = (value == 'N' || value == '') ? 'false' : true;
          }
          if (formfields.isCheck == 'DD') {

            let value = _.find(formfields.options, function (o) {
              return o.DV == formfields.value

            });

            if (value) {

            } else {
              formfields.value = '';
            }
          }
        }



      })
    } else {

      (this.mainprofile.length == 0) ? localStorage.setItem('ProfileId', '-1'): localStorage.setItem('ProfileId', '0');
      localStorage.removeItem('ProfileName');
      this.prof = new Profile();
      this.prof.ProfileName = 'Select Profile';
      this.prof.Image = "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
      let localthis = this;
      _.forEach(localthis.terminalFormFields, function (formfields, index) {
        formfields.value = '';
      })
      this.number = null;

    }


    this.form = this.formControlProvider.toFormGroup(this.terminalFormFields);
    this.overlayHidden = true;


  }


  takePicture(sourceType: number): void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {

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
      console.log(err);
      // Handle error
    });
  }

  showFilterPopUp() {
    this.overlayHidden = false;
  }

  openFilter() {
    this.overlayHideFilter = false;
  }

  closeFilter(closecler: string) {

    if (closecler == 'Cancel') {
      this.overlayHideFilter = true;

    } else {

      this.mainprofile = this.filtermainprofile;
      this.filterValueArry = [];
      this.filterProfiles = [];
      this.displayFilterVal = '';
      this.filterValueModel = "showAll";
      this.sortValueModel = "showAll";
      this.overlayHideFilter = true;
    }

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

  getfilename(filestring) {
    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    return file;
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    this.fileExtention = file;
    return file;
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
        }, err => {
          this.loadingProvider.hide();

        });
      }, err => {
        this.loadingProvider.hide();

      });
    });

  }


  /**
   * this method is used to upload image in amazone s3 bucket
   * @param  {any} file
   * @returns void
   */
  uploadfile(file: any): void {

    const bucket = new S3({
      accessKeyId: environment.amazonS3AccessKeyId,
      secretAccessKey: environment.amazonS3SecretAccessKey,
      region: environment.amazonS3Region,
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
        localThis.loadingProvider.hide();

        return false;
      } else {
        localThis.uploadfilename = data.Location;
        localThis.loadingProvider.hide();

        if (localThis.uploadfilename) {
          localStorage.setItem('AwsFilePath', JSON.stringify(localThis.uploadfilename));
        }
        return true;
      }
    });
  }

  onSubmit() {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      let formFields = [];
      this.payLoad = JSON.stringify(this.form.value);


      Object.keys(this.form.value).forEach((objkey) => {
        const obj = {
          key: objkey,
          value: this.form.value[objkey],
          isFile: false,
          fileExe: ''
        };
        let localthis = this;

        if (localthis.SelectedDate) {
          let valuedate = _.includes(obj, localthis.SelectedDate);
          if (valuedate == true) {

            obj.value = moment(obj.value.split('T')[0]).format("DD MMM YYYY");

          }
        }
        if (obj.value === true) {
          obj.value = 'Y';
        } else if (obj.value === false || obj.value === 'false') {
          obj.value = 'N';
        }
        if (obj.key != '') {
          formFields.push(obj);
        }

      })
      let findfile = this.terminalFormFields.find(obj => obj.KT == 'FA');
      let localthis = this;
      if (findfile) {
        const fileobj = {
          key: findfile.formName,
          value: localthis.filename,
          isFile: true,
          fileExe: localthis.fileExtention
        }
        formFields.push(fileobj);
      }
      this.appState.setFormField(formFields);


      if (this.terminal.FT == 'AA' || (this.terminal.FT == 'BB' && !this.marknoOrder)) {
        this.navCtrl.push('PlaceOrderPage');
      } else if (this.terminal.FT == 'CO' || (this.terminal.FT == 'ER' && this.terminal.Sections.length == 0) || (this.terminal.FT == 'ER' && this.terminal.Sections.length > 0) || this.terminal.FT == 'ST' || this.terminal.FT == 'SS') {
        this.navCtrl.push('ConfirmOrderPage');
      } else if (this.terminal.FT == 'DO') {
        this.navCtrl.push('BookAppointmentPage');
      } else if (this.marknoOrder) {

        //code for order no mark  

        if (!this.loadingProvider.loading) {
          this.loadingProvider.show('please wait...');
        }

        this.placeOrderModel = this.commonProvider.getTerminalOrderDetail();
        this.placeOrderModel.InfoArray.ProfileName = this.displayProfileName;
        this.deviceInfo = this.commonProvider.getDeviceInfo();
        let localthis = this;
        _.forEach(localthis.terminal.MarkNoOrder, function (item, index) {
          //localthis.placeOrderModel.InfoArray[item.FN] = item.QTY.toString();
          let tempitem = new SessionItem();
          tempitem.FId = item.FId;
          tempitem.Fname = item.Fname;
          tempitem.price = item.price;
          tempitem.Qty = item.Qty.toString();
          tempitem.section_Email = item.section_Email;
          tempitem.section_Id = item.section_Id;
          localthis.placeOrderModel.InfoArray.ItemsArray.push(tempitem);

        })


        if (this.platform.is('core')) {
          this.postOrder();
        } else {
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
    }
  }


  /**
   * this method is used to post no mark order for perticular terminal
   * @returns void
   */
  postOrder(): void {

    this.terminalProvider.getTransactionToken(this.terminal.WrioCode, this.user.UserId).subscribe(res => {
      this.placeOrderModel.TransactionToken = res;
      this.placeOrderModel.InfoArray.TransactionToken = res;
    this.placeOrderModel.InfoArray.Device_Stats = JSON.stringify(this.deviceInfo);

    this.terminalProvider.placeOrder(this.placeOrderModel).subscribe(res => {
      if (res) {

        this.appState.deleteTerminal();
        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
        }
        this.navCtrl.popToRoot();

      }

    }, err => {

      if (this.loadingProvider.loading) {
        this.loadingProvider.hide();
        this.loadingProvider.loading = null;
      }
    })
  })

  }


  get isValid() {
    return this.form.controls[this.terminalFormFields[0].key].valid;
  }

  dateFormat() {

    this.SelectedDate = moment(this.SelectedDate.split('T')[0]).format("DD MMM YYYY");

  }

  getnumber() {
    if (!this.number) {
      this.ngZone.run(() => {
        this.number = '+' + Number('91');
      })
    }
  }



  navigateTo(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.navCtrl.push('TerminalInfoPage', {
        id: this.terminal.WrioCode
      });
    }

  }

  Removefile() {
    this.filename = null;
    this.fileExtention = null;
    this.uploadfilename = null;
  }


  filterValue(Key: any) {
    let localthis = this;
    this.mainprofile = this.filtermainprofile;
    this.filterValueArry = new Array < any > ();
    _.forEach(localthis.mainprofile, function (item) {
      let data = JSON.parse(item.Data);
      let value = _.get(data, Key);
      if (value) {
        let obj = {
          filtervalue: value
        }

        localthis.filterValueArry.push(obj);
      }
    })
    this.filterValueArry = _.uniqBy(this.filterValueArry, function (e) {
      return e.filtervalue;
    });
  }

  DisplayFilterValue(value: any) {
    this.displayFilterVal = value;
  }

  filterMainProfile() {
    if (this.displayFilterVal) {
      let localthis = this;
      this.filterProfiles = [];
      this.mainprofile = this.filtermainprofile;
      _.forEach(localthis.filtermainprofile, function (item) {
        let data = JSON.parse(item.Data)
        let getkeyvalue = _.get(data, localthis.filterValueModel);
        if(getkeyvalue)
        {
        if(getkeyvalue==localthis.displayFilterVal)
        {
          localthis.filterProfiles.push(item)
        }
      }
      })

      this.mainprofile = [];
      this.mainprofile = this.filterProfiles;
      this.overlayHideFilter = true;
    } else {
      this.alertProvider.showSucessProfile('Please select filter');
    }

  }


  sortProfile() {
    if (this.filterProfiles.length > 0 && this.sortValueModel != "showAll") {
      let localthis = this;
      //get ASC
      this.filterProfiles = _.sortBy(localthis.filterProfiles, localthis.sortValueModel);
      //get DESC 
      if (this.sortIcon == "md-arrow-down") {
        this.filterProfiles = this.filterProfiles.reverse();
      }
      this.mainprofile = [];
      this.mainprofile = this.filterProfiles;
    }
  }
  changeIcon() {
    if (this.sortValueModel != "showAll") {
      this.sortIcon = (this.sortIcon == "md-arrow-down") ? "md-arrow-up" : "md-arrow-down";
    } else {
      this.alertProvider.showSucessProfile('Please select fields to sort');
    }

  }
}
