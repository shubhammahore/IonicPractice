import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{Item} from '../../models/terminal';

/**
 * Generated class for the ItemdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-itemdetails',
  templateUrl: 'itemdetails.html',
})
export class ItemdetailsPage {
sectionItem:Item;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.sectionItem=this.navParams.get('sectionitem');
   

  }

  ionViewDidLoad() {
  
  }

}
