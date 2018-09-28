import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ChildUser} from './childUser/ChildUser';


@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class Users {
  constructor (private navCtr:NavController) {}
  onLoadUser(name:string) {
    this.navCtr.push(ChildUser, {userName:name});
  }

  ionViewCanEnter():boolean | Promise<boolean> {
   console.log('ionViewCanEnter');
   const rnd=Math.random();
   return rnd>0.5;
  }
}
