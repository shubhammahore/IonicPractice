import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  ActionSheetController,
  Platform
} from 'ionic-angular';
import {
  AccountProvider
} from '../../providers/account';
import {
  User
} from '../../models/account';
import {
  DashboardPage
} from '../dashboard/dashboard';
import {
  LoadingProvider
} from '../../providers/loading';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import {
  environment
} from '../../environments/environment';
import * as moment from 'moment';
import {
  FilePath
} from '@ionic-native/file-path';
import {
  FileChooser
} from '@ionic-native/file-chooser';
import {
  ProfilesProvider
} from '../../providers/profiles';
import {
  File
} from '@ionic-native/file';
import {
  TerminalDetail,
  FormField
} from '../../models/terminal';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AlertProvider
} from '../../providers/alert';
declare var window;
@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html',
})
export class UserRegistrationPage {

  user: User = new User();

  roles = [{
      type: 'radio',
      label: 'Customer',
      value: 'CU',
      checked: true
    },
    {
      type: 'radio',
      label: 'Retailer',
      value: 'RT',
      checked: false
    },
    {
      type: 'radio',
      label: 'Salesman',
      value: 'SM',
      checked: false
    }
  ];
  filename: any = null;
  phoneNo: any;
  uploadfilename: any = null;
  todayfiletime = new Date().getTime();
  todayfiledate = moment().format('YYYY-MM-DD');
  terminal: TerminalDetail;

  constructor(public navCtrl: NavController,
    public platform: Platform,
    private fileChooser: FileChooser,
    public navParams: NavParams,
    private accountProvider: AccountProvider,
    private loadingProvider: LoadingProvider,
    private appStateProvider: AppStateProvider,
    private camera: Camera, private filePath: FilePath,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    public actionSheetCtrl: ActionSheetController, private profilesProvider: ProfilesProvider) {
    this.user.EmailId = `${this.navParams.get('EmailId')}@deviseapps.com`;
    this.phoneNo = this.navParams.get('EmailId');
    this.user.DeviceARN = localStorage.getItem('FCMToken');
    // this.user.Image = 'http://cdn2.itpro.co.uk/sites/itpro/files/styles/article_main_wide_image/public/2018/01/android_vs_ios.jpg?itok=TsCRWKWY';
    this.user.DeviceOS = 'android';
    this.user.Uname = '';
    this.user.UserRole = 'CU';
    this.user.Image = '';
    this.terminal = this.appStateProvider.getTerminal();
  }


  ionViewDidLoad(): void {}

  userRegistration(user: User): void {

    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      if (!this.loadingProvider.loading) {
        this.loadingProvider.show('please wait...');
      }

      user.Image = (this.uploadfilename) ? this.uploadfilename : "https://s3.amazonaws.com/checkinprodnewapr2017/default_user-856f2487c07862f3089cfcb1528df354.png";
      this.accountProvider.UserLoginOrRegister(user).subscribe(res => {
        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
        this.getUserAccountInfo(res.UserId);
      }, err => {

        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
      });
    }
  }




  getUserAccountInfo(userId: number): void {
    this.accountProvider.getUserAcccountInfo(userId).subscribe(res => {
      this.appStateProvider.setUserProfile(res[0]);
      if (this.platform.is('core')) {
        this.navCtrl.setRoot(DashboardPage);
      } else {
        this.profilesProvider.getProfiles(userId).subscribe(profiles => {


          this.profilesProvider.createProfileDb(profiles).subscribe(res => {
            this.navCtrl.setRoot(DashboardPage);
          })

        })
      }

    }, err => {
      console.log(err);
    });
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
      if (!this.loadingProvider.loading) {
        this.loadingProvider.show('please wait...');
      }
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



  getfilename(filestring) {
    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    return file;
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
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
          if (!this.loadingProvider.loading) {
            this.loadingProvider.show('please wait...');
          }
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

  uploadfile(file: any): void {

    const bucket = new S3({
      accessKeyId: environment.amazonS3AccessKeyId,
      secretAccessKey: environment.amazonS3SecretAccessKey,
      region: environment.amazonS3Region
    });
    const params = {
      Bucket: environment.amazonS3Bucket,
      Key: `FileAttachements/${this.phoneNo}.${file.fileext}`,
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
      if (localThis.loadingProvider.loading) {
        localThis.loadingProvider.hide();
        localThis.loadingProvider.loading = null;
      }

      return true;
    });
  }



  Removefile() {
    this.filename = null;
    this.uploadfilename = null;
  }
}
