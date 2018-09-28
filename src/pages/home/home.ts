import { Component } from '@angular/core';
import { Users } from '../users/users';
import { NavController } from 'ionic-angular';

//import { ShopPage } from '../shop/shop';
//import { BuyoutPage } from '../buyout/buyout';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
user = Users;
constructor(public navCtrl: NavController) {
  //console.log('hello');
}

onGoToUsers(){
  console.log("Hello hi");
  this.navCtrl.push(this.user)
 .catch((error) => console.log('Access Denied , Argument was '+ error));
 console.log("Hello byee");
}

// onGoToUsers(){
//   this.navCtrl.push(this.user)
//   .catch((error) => console.log('Access Denied , Argument was '+ error));
//   //this.navCtrl.setRoot(Users);
// }
  /*
 
  
  onGoToShop(){
    this.navCtrl.push(ShopPage)
  }


  // onGoToBuy(){
  //   this.navCtrl.push(BuyoutPage)
  // }

  */
}
