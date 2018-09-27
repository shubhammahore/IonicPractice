import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Users} from '../pages/users/users';
import {ChildUser} from '../pages/users/childUser/ChildUser';
import { BuyoutPage } from '../pages/buyout/buyout';
import { ShopPage } from '../pages/shop/shop';
import { AllPage } from '../pages/all/all';
import { CompletedPage } from '../pages/completed/completed';
import { WaitingPage } from '../pages/waiting/waiting';
import { OthersPage } from '../pages/others/others';
import { SmPage } from '../pages/sm/sm';
import {ProfilePopoverPage} from '../pages/profile-popover/profile-popover';
import { LoginPage } from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Users,
    ChildUser,
    BuyoutPage,
    ShopPage,
    AllPage,
    CompletedPage,
    WaitingPage,
    OthersPage,
    SmPage,
    ProfilePopoverPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement:'top'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Users,
    ChildUser,
    BuyoutPage,
    ShopPage,
    AllPage,
    CompletedPage,
    WaitingPage,
    OthersPage,
    SmPage,
    ProfilePopoverPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
