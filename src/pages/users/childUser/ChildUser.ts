import {Component, OnInit} from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

@Component({
    selector: 'page-child',
    templateUrl: 'ChildUser.html',
  })
  export class ChildUser implements OnInit {
    name:string;
    constructor(private navParams : NavParams, private navCtrl:NavController ){}
    ngOnInit() {
       
        this.name = this.navParams.get('userName');
    }
    onGoBack(){
      this.navCtrl.pop();
     // this.navCtrl.popToRoot();//to go into Root page
    }
  }