import { Component } from '@angular/core';
import { Users } from '../users/users';
//import { NavController } from 'ionic-angular';
//import { Users } from '../users/users';
//import { ShopPage } from '../shop/shop';
//import { BuyoutPage } from '../buyout/buyout';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
user = Users;


  /*
  constructor(public navCtrl: NavController) {
    //console.log('hello');
  }
  onGoToUsers(){
    this.navCtrl.push(Users);
    //this.navCtrl.setRoot(Users);
  }
  onGoToShop(){
    this.navCtrl.push(ShopPage)
  }


  // onGoToBuy(){
  //   this.navCtrl.push(BuyoutPage)
  // }

  */
}
