import {
  Component
} from '@angular/core';
import {
  Platform,
  AlertController
} from 'ionic-angular';
import {
  StatusBar
} from '@ionic-native/status-bar';
import {
  SplashScreen
} from '@ionic-native/splash-screen';

import {
  LoginPage
} from '../pages/login/login';
import {
  Push,
  PushObject,
  PushOptions
} from '@ionic-native/push';
import {
  environment
} from '../environments/environment';
import {
  AppStateProvider
} from '../providers/app-state';
import {
  AppVersion
} from '@ionic-native/app-version';
import {
  Keyboard
} from '@ionic-native/keyboard';


import {
  ConnectivityProvider
} from '../providers/connectivity';
import {
  AlertProvider
} from '../providers/alert';

import {
  ProfilesProvider
} from '../providers/profiles';
import{DashboardPage} from '../pages/dashboard/dashboard';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  userInfo: any;

  constructor(public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public push: Push,
    private profilesProvider: ProfilesProvider,
    public appState: AppStateProvider,
    private alertCtrl: AlertController,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    private appVersion: AppVersion,
    private keyboard: Keyboard,

  ) {

    this.connectivityProvider.connectivityStatus.subscribe(res => {

      if (!res) {
        this.alertProvider.show();
      }
    })

    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    }
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.keyboard.disableScroll(true);
      splashScreen.hide();
      this.registerPush();
    });



    this.appVersion.getAppName().then(res => {
      localStorage.setItem('AppName', res);
    })


    this.appVersion.getVersionNumber().then(res => {
      localStorage.setItem('AppVersion', res);

    })
    this.userInfo=this.appState.getUserProfile();
    if(this.userInfo)
    {
     this.profilesProvider.IsUserLogin(this.userInfo.UserId).then(data=>{
       if(data=='True')
       {
       this.rootPage=DashboardPage;
       }else{
        this.rootPage=LoginPage;
       }
     })
    }else{this.rootPage=LoginPage;}


  }


  
  /**
   * This Method Is Used For Push Notification 
   */
  registerPush() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: environment.googleSenderID,
        iconColor: 'blue',
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      
      this.appState.setFCMToken(data.registrationId)
     
    });

    pushObject.on('notification').subscribe((data: any) => {
      
      let notiInfo = JSON.parse(data.message);
     
      if (data.additionalData.foreground) {
        // if application open, show popup
        setTimeout(() => {

          let alert = this.alertCtrl.create({
            title: notiInfo.title,
            message: notiInfo.Text,
            buttons: [{
                text: 'Cancel',
                role: 'cancel'

              },
              {
                text: 'Proceed',
                handler: data => {


                }
              }
            ]
          });
          alert.present();

        }, 3000);
      }

      // this.notificationService.sendNotification({ event: 'pushNotification', data: data });
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
}
