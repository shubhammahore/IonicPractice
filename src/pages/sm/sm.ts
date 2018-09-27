import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AllPage } from '../all/all';
import { CompletedPage } from '../completed/completed';
import { WaitingPage } from '../waiting/waiting';
import { OthersPage } from '../others/others';



@IonicPage()
@Component({
  selector: 'page-sm',
  templateUrl: 'sm.html'
})
export class SmPage {

  allRoot = AllPage;
  completedRoot = CompletedPage;
  waitingRoot = WaitingPage;
  othersRoot = OthersPage;


  constructor(public navCtrl: NavController) {}

}
