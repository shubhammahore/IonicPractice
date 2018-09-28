
import { ViewLog } from '../../models/viewlog';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the ViewlogdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewlogdetail',
  templateUrl: 'viewlogdetail.html',
})
export class ViewlogdetailPage {
  viewdata=new ViewLog();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.viewdata=this.navParams.get('viewdata');
    console.log('viewdata', this.viewdata);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewlogdetailPage');
  }

}
