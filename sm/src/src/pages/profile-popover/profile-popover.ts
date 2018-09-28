import { AlertProvider } from './../../providers/alert/alert';
import { ConnectivityProvider } from './../../providers/connectivity/connectivity';
import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import{LoginPage}  from '../login/login';
import {
  ProfilesProvider
} from '../../providers/profiles';

/**
 * Generated class for the ProfilePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-popover',
templateUrl: 'profile-popover.html',
})
export class ProfilePopoverPage {


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePopoverPage');
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public connectivityProvider: ConnectivityProvider,
              public viewCtrl: ViewController,
              public alertProvider: AlertProvider,
              private profilesProvider: ProfilesProvider
            ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  viewSettings(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.navCtrl.push('SettingsPage');
    }
  }
  
  logout():void{
    this.viewCtrl.dismiss();
    this.profilesProvider.dropUserLogin();
    localStorage.removeItem('accesskey');
    this.navCtrl.setRoot(LoginPage);
  }
}
