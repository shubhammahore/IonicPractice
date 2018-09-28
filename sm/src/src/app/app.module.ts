import { ProfilePopoverPage } from './../pages/profile-popover/profile-popover';
import { UseraccountProvider } from './../providers/useraccount/useraccount';
// angulat and ionic imports
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SQLite} from '@ionic-native/sqlite';
// ionic native imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Keyboard } from '@ionic-native/keyboard';
import { Toast } from '@ionic-native/toast';
import { FileChooser } from '@ionic-native/file-chooser';
// pages imports
import { LoginPage } from '../pages/login/login';
import { File } from '@ionic-native/file';
import { PipesModule } from '../pipes/pipes.module';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AccountProvider } from '../providers/account';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TerminalProvider } from '../providers/terminal/terminal';
import { Push } from '@ionic-native/push';
import { AlertProvider } from '../providers/alert/alert';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { LoadingProvider } from '../providers/loading';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { ToastProvider } from '../providers/toast';
import { AppStateProvider } from '../providers/app-state';
import { FormControlProvider } from '../providers/form-control';
import { UserRegistrationPage } from '../pages/user-registration/user-registration';
import { AndroidPermissions} from '@ionic-native/android-permissions';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Camera } from '@ionic-native/camera';
import { BatteryStatus } from '@ionic-native/battery-status';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FilePath } from '@ionic-native/file-path';
import { CommonProvider } from '../providers/common';
import { ProfilesProvider } from '../providers/profiles/profiles';

import {createConnection} from "typeorm";
import { PaymentProvider } from '../providers/payment/payment';
import { InAppBrowser } from '@ionic-native/in-app-browser';




@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    DashboardPage,
    UserRegistrationPage,
    ProfilePopoverPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms : {
        android : {
          // These options are available in ionic-angular@2.0.0-beta.2 and up.
          scrollAssist: false,    // Valid options appear to be [true, false]
          autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
        }
      }
    }),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicImageViewerModule,
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    DashboardPage,
    UserRegistrationPage,
    ProfilePopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AccountProvider,
    TerminalProvider,
    LoadingProvider,
    Facebook,
    Push,
    GooglePlus,
    ToastProvider,
    InAppBrowser,
    Toast,
    ConnectivityProvider,
    Network,
    Keyboard,
    AppStateProvider,
    AlertProvider,
    FormControlProvider,
    AndroidPermissions,
    Device,
    Camera,
    AppVersion,
    BatteryStatus,
    Geolocation,
    Diagnostic,
    FileChooser,
    File,
    FilePath,
    CommonProvider,
    ProfilesProvider,
    SQLite,
    UseraccountProvider,
    PaymentProvider
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppModule { }
