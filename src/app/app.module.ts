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
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Users,
    ChildUser,
    BuyoutPage,
    ShopPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Users,
    ChildUser,
    BuyoutPage,
    ShopPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
