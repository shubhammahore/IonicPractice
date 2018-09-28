import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePopoverPage');
  }
  onGoBack(){
    this.navCtrl.pop();
  }
  setting() {

  }
  logout() {
    this.navCtrl.push(LoginPage);
  }
  filter() {

  }
  report(){

  }

}
