import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  ActionSheetController
} from 'ionic-angular';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import {
  DashboardPage
} from '../dashboard/dashboard';
import * as S3 from 'aws-sdk/clients/s3';
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
  LoadingProvider
} from '../../providers/loading';
import {
  ProfilesProvider
} from '../../providers/profiles';
import {
  Profile
} from '../../models/profile';
import {
  Safepipe
} from './../../pipes/safe/safe';
import {
  environment
} from './../../environments/environment';
import {
  TerminalDetail
} from './../../models/terminal/terminal.model';
import {
  AppStateProvider
} from './../../providers/app-state/app-state';
import * as moment from 'moment';
import * as _ from 'lodash';
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
/**
 * Generated class for the OrderSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-success',
  templateUrl: 'order-success.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class OrderSuccessPage {
  orderData = [];
  ProfileId: any;
  infoArray: any;
  profileData: any;
  profileName: string = '';
  checkedItems: boolean = false;
  checkedProfile: boolean = false;
  imgText: string = 'Select a Profile Picture';
  selectedImg: string = 'assets/icon/user.jpg';
  overlayHidden: boolean = true;
  overlayHiddenUpdate: boolean = true;
  filename: any = 'Select a Profile Picture';
  uploadfilename: any = null;
  terminal: TerminalDetail;
  todayfiletime = new Date().getTime();
  todayfiledate = moment().format('YYYY-MM-DD');
  isKeyboardHide: boolean = true;
  editUpdateProfile: string = '';
  formField = [];
  sectionItemField = {
    items1: [],
    subtotal: 0,
    total: 0
  };
  userInfo: any;
  today = moment().format('DD MMM YYYY h:mm:ss a');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public app: App,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    private filePath: FilePath,
    private fileChooser: FileChooser,
    private camera: Camera,
    public ngZone: NgZone,
    private keyboard: Keyboard,
    private loadingProvider: LoadingProvider,
    private appStateProvider: AppStateProvider,
    public actionSheetCtrl: ActionSheetController,
    public profilesProvider: ProfilesProvider, private cdRef: ChangeDetectorRef
  ) {

    this.terminal = this.appStateProvider.getTerminal();
    this.formField = this.appStateProvider.getFormField();
    this.userInfo = this.appStateProvider.getUserProfile();
    this.sectionItemField = this.appStateProvider.getSessionItem();

    this.orderData = this.navParams.get('orderDetail');
    this.infoArray = this.navParams.get('InfoArray');
    this.ProfileId = localStorage.getItem('ProfileId');
    localStorage.setItem('PageName', 'OrderSuccessPage');
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
    });

  }


  ionViewDidLoad() {
    this.getProfile();

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
          this.infoArray.Image = "https://s3.amazonaws.com/mwrio/UserAccountPicture/Wrio_client_logo.png";
          this.infoArray.ProfileName = 'My Wrio Profile';

        } else {

          this.infoArray.Image = (this.uploadfilename) ? this.uploadfilename : "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
          this.infoArray.ProfileName = this.profileName;
        }
        delete this.infoArray['DeviceARN'];
        delete this.infoArray['Device_Stats'];
        delete this.infoArray['ItemsArray'];
        delete this.infoArray['Total'];
        delete this.infoArray['TransactionToken'];
        this.profilesProvider.Post(this.infoArray).subscribe(res => {
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

    delete this.infoArray['DeviceARN'];
    delete this.infoArray['Device_Stats'];
    delete this.infoArray['ItemsArray'];
    delete this.infoArray['Total'];
    delete this.infoArray['TransactionToken'];
    if (this.profileData && this.profileData.IsDefault == 'YES') {
      this.infoArray.Image = "https://s3.amazonaws.com/mwrio/UserAccountPicture/Wrio_client_logo.png";

    } else {
      this.infoArray.Image = (this.uploadfilename) ? this.uploadfilename : "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
    }
    this.profilesProvider.update(this.infoArray, this.profileData.ProfileId, this.infoArray.UserId).subscribe(res => {
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

  showOverlay() {

    this.ngZone.run(() => {
      if ((this.profileData && this.profileData.IsDefault == 'YES') || this.ProfileId == null || this.ProfileId == '0' || this.ProfileId == '-1') {
        this.overlayHidden = false;
      } else {
        this.overlayHiddenUpdate = false;
      }
    })
  }

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
          this.uploadfile(file);
        })
      }
    }, (err) => {
      console.log(err);
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
      Key: `UserAccountPicture/${this.userInfo.UserId}'_'${this.ProfileId}.${file.fileext}`,
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
      localThis.selectedImg = data.Location;
      localThis.loadingProvider.hide();
      return true;
    });
  }

  readimage(_imagePath, name, type) {
    return new Promise((resolve, reject) => {
      var myPath = _imagePath;
      window.resolveLocalFileSystemURL(myPath, (fileEntry) => {

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
          this.imgText = 'Profile Picture is Selected';
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
    this.ngZone.run(() => {
      this.imgText = 'Select a Profile Picture';
      this.selectedImg = 'assets/icon/user.jpg';
    })
  }

  closeOverlay() {
    this.ngZone.run(() => {
      this.checkedItems = false;
      this.checkedProfile = false;
      this.profileName = ''
      this.selectedImg = 'assets/icon/user.jpg';
      this.imgText = 'Select a Profile Picture';
      this.overlayHidden = true;
    })
  }

  closeUpdateOverlay() {
    this.ngZone.run(() => {
      this.overlayHiddenUpdate = true;
    })
  }

  navigateToDashboard(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.appStateProvider.deleteTerminal();
      this.navCtrl.popToRoot();
    }
  }

  ionViewDidLeave(): void {
    localStorage.removeItem('ProfileId');
  }

}
