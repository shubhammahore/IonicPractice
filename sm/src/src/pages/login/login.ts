// angular and ionic imports
import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  Platform
} from 'ionic-angular';
import * as _ from 'lodash';
import {
  AndroidPermissions
} from '@ionic-native/android-permissions';

// provider imports
import {
  LoadingProvider
} from '../../providers/loading';
import {
  ToastProvider
} from '../../providers/toast';
import {
  AccountProvider
} from '../../providers/account';

// page import
import {
  DashboardPage
} from '../dashboard/dashboard';

// model import
import {
  OTPInfo,
  User
} from '../../models/account';
import {
  UserRegistrationPage
} from '../user-registration/user-registration';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  Keyboard
} from '@ionic-native/keyboard';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AlertProvider
} from '../../providers/alert';
import {
  ProfilesProvider
} from '../../providers/profiles';
// import 'reflect-metadata';
import {
  createConnection
} from "typeorm";
import {
  Profile
} from '../../models/profile';
import "reflect-metadata";
declare var window;
declare var SMS: any;
import {
  SQLite,
  SQLiteObject
} from '@ionic-native/sqlite';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginPage {

  oTP: OTPInfo = new OTPInfo();
  countryCode = '+91';
  title = 'Log In/Sign In';
  user: User = new User();
  isOTPConfirmation = false;
  isKeyboardHide: boolean = true;
  mainprofile: Array < Profile >= [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private accountProvider: AccountProvider,
    private loadingProvider: LoadingProvider,
    private toastProvider: ToastProvider,
    public alertCtrl: AlertController,
    public androidPermissions: AndroidPermissions,
    public platform: Platform,
    private appStateProvider: AppStateProvider,
    private keyboard: Keyboard,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    private cdRef: ChangeDetectorRef,
    private profilesProvider: ProfilesProvider,
    private sqlite: SQLite) {
    this.oTP.countryCode = '91';
    this.user.DeviceARN = localStorage.getItem('FCMToken');
    this.user.Image = 'http://cdn2.itpro.co.uk/sites/itpro/files/styles/article_main_wide_image/public/2018/01/android_vs_ios.jpg?itok=TsCRWKWY';
    this.user.DeviceOS = 'android';
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;

    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;

    });
  }



  ionViewDidEnter() {
    this.platform.ready().then((readySource) => {

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
        success => {

        },
        err => {

          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
        });
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);

      if (SMS) SMS.startWatch(() => {

      }, Error => {

      });

      document.addEventListener('onSMSArrive', (receivedMessage: any) => {

        setTimeout(() => {
          if (receivedMessage.data.address.includes('WRIOIN')) {
            this.oTP.OTP = receivedMessage.data.body.split(' ')[0];

            this.oTPVerification(this.oTP);
          } else {
            if (SMS) SMS.stopWatch(() => {

            })
            let alert = this.alertCtrl.create({
              message: 'We are unable to detect the OTP. Please enter the OTP manually',
              buttons: [{
                text: 'OK',
              }]
            });
            alert.present();
          }
        }, 1000);
      })

    });

  }

  ionViewDidLeave() {
    localStorage.removeItem('ProfileId');
    if (SMS) SMS.stopWatch(() => {

    })
  }


  ReadListSMS(): void {
    let filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft'
      read: 0,
      indexFrom: 0, // start from index 0
      maxCount: 5
    };

    if (SMS) SMS.listSMS(filter, (ListSms) => {

        let smsIndex: number = ListSms.findIndex(x => x.address.includes('WRIOIN'));
        if (smsIndex !== -1) {
          this.oTP.OTP = ListSms[smsIndex].body.split(' ')[0];
          this.oTPVerification(this.oTP);
        }
      },

      Error => {
        console.log('error list sms: ' + Error);
      });

  }



  /**
   * this method is used for generate OTP
   * @param  {OTP} oTP
   * @returns void.
   */
  generateOTP(oTP: OTPInfo): void {
    
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.loadingProvider.show('please wait ...');
      this.accountProvider.generateOTP(oTP).subscribe(res => {
        this.isOTPConfirmation = true;
        this.title = 'WRIO';
        this.loadingProvider.hide();
        this.loadingProvider.loading = null;
      }, err => {
        this.toastProvider.show('something unexpected happens please try again');
        this.loadingProvider.hide();
        this.loadingProvider.loading = null;
      });
    }
    // this.clientLogin('919096789390@deviseapps.com', false);
    // this.clientLogin('919860400723@deviseapps.com',false);
    // this.clientLogin('917798982717@deviseapps.com',false);
  }


  /**
   * this method is used for otp verification
   * @param  {OTP} oTP
   * @returns void
   */
  oTPVerification(oTP: OTPInfo): void {
    //oTP.phoneNumber = `91${oTP.phoneNumber}`;
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.accountProvider.oTPVerification(oTP).subscribe(res => {
        if (res.authenticate) {
          let number = this.oTP.countryCode + this.oTP.phoneNumber;
          this.clientLogin(`${number}@deviseapps.com`, false);
        }
      }, err => {
        this.toastProvider.show('something unexpected happens please try again');
      });
    }
  }


  /**
   * @param  {string} EmailId
   * @returns void
   */
  clientLogin(EmailId: string, isExternalLogin: boolean): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.accountProvider.clientLogin(EmailId).subscribe(res => {
        if (res === 'InvalidUser') {
          (isExternalLogin) ? this.userRegistration(this.user):
            this.presentConfirm();
        } else {
          this.getUserAccountInfo(res.UserId);
        }
      }, err => {
        console.log(err);
      });
    }
  }

  /**
   * This method used for create new user account
   * @param  {User} user
   * @returns void
   */
  userRegistration(user: User): void {
    if (!this.loadingProvider.loading) {
      this.loadingProvider.show('please wait...');
    }
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

  /**
   * this method is used for get user information
   * @param  {number} userId
   * @returns void
   */
  getUserAccountInfo(userId: number): void {
    this.accountProvider.getUserAcccountInfo(userId).subscribe(res => {
      this.appStateProvider.setUserProfile(res[0]);
    
      if (this.platform.is('core')) {
        this.navCtrl.setRoot(DashboardPage);

        // comment below block when you dont want to use sqllite
      } else {
        this.profilesProvider.createUserLogin(userId);
        this.profilesProvider.getProfiles(userId).subscribe(profiles => {
          console.log('profiles',profiles);
          this.profilesProvider.createProfileDb(profiles).subscribe(res => {
            this.navCtrl.setRoot(DashboardPage);
          })
        })
      
      }
      
     /* comment below block when you run android build */
     /*
      } else {
        this.navCtrl.setRoot(DashboardPage);
      }
      */
    }, err => {
      console.log(err);
    });
  }

  changeNo(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.oTP.OTP = '';
      this.isOTPConfirmation = false;
      this.title = 'Log In/Sign In';
    }
  }

  changeValue(value) {
    //manually launch change detection
    this.cdRef.detectChanges();
    this.oTP.OTP = value.length > 4 ? value.substring(0, 4) : value;
    if (this.oTP.OTP.length === 4) {
      this.oTPVerification(this.oTP);
    }
  }

  /**
   * this method is used for log in user using facebook
   * @returns void
   */
  loginThroughFacebook(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.accountProvider.loginThroughFacebook().then(res => {
        if (res.status === 'connected') {
          this.getUserDetailThroughFacebook(res.authResponse.userID);
        }
      }, err => {
        this.toastProvider.show('something unexpected happens please try again');
      });
    }
  }

  /**
   * this method is used for log in user through google
   * @returns void
   */
  loginThroughGoogle(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.accountProvider.loginThroughGoogle().then(res => {

        if (!res.error) {
          this.user.EmailId = res.email;
          this.user.Uname = res.displayName;
          this.user.UserRole = 'CU';
          this.clientLogin(`${res.email}`, true);
        } else {
          this.toastProvider.show('There was an error. Please try again later');
        }
      }, err => {
        console.log(err);
      });
    }
  }

  /**
   * this method used for get user details facebook
   * @param  {} userID
   * @returns void
   */
  getUserDetailThroughFacebook(userID: string): void {
    this.accountProvider.getUserDetailThroughFacebook(userID).then(res => {
      this.user.Image = res.picture.data.url;
      this.user.EmailId = res.email;
      this.user.Uname = res.name;
      this.user.UserRole = 'CU';
      this.clientLogin(`${res.email}`, true);

    }, err => {
      console.log(err);
    });
  }


  presentConfirm(): void {
    let alert = this.alertCtrl.create({
      message: 'Inorder to continue, you must register first. Do you want to register now?',
      buttons: [{
          text: 'no'
        },
        {
          text: 'yes',
          handler: () => {
            this.navCtrl.push(UserRegistrationPage, {
              EmailId: this.oTP.countryCode + this.oTP.phoneNumber
            });
          }
        }
      ]
    });
    alert.present();
  }

}
