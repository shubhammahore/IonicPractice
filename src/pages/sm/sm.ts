import { Component } from '@angular/core';
import { IonicPage, NavController,PopoverController } from 'ionic-angular';
import { AllPage } from '../all/all';
import { CompletedPage } from '../completed/completed';
import { WaitingPage } from '../waiting/waiting';
import { OthersPage } from '../others/others';
import {ProfilePopoverPage} from '../profile-popover/profile-popover';


@IonicPage()
@Component({
  selector: 'page-sm',
  templateUrl: 'sm.html'
})
export class SmPage {
  //popover=ProfilePopoverPage;
  allRoot = AllPage;
  completedRoot = CompletedPage;
  waitingRoot = WaitingPage;
  othersRoot = OthersPage;
  

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {}
  presentPopover(myEvent){
    let popover = this.popoverCtrl.create(ProfilePopoverPage);
    popover.present({
      ev: myEvent
    });
    //this.navCtrl.push(ProfilePopoverPage);

  }
}
