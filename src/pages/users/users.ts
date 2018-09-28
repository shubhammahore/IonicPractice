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

  ionViewCanEnter():boolean | Promise<void> {
   console.log('ionViewCanEnter');
   const rnd=Math.random();
   return rnd>0.1;
  }

  ionViewDidLoad(){
   console.log('ionViewDidLoad');
   
  }

  ionViewCanLeave():boolean | Promise<void>{
    console.log('ionViewCanLeave');
    // const promise= new Promise(( resolve , reject)) => {
    //   setTimeout(()=>{
    //     resolve();
    //   },1000);
    // });
     return true;
  }
  ionViewDidEnter()  {
    console.log('ionViewDidEnter');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
  }
  ionViewDidLeave(){
    console.log('ionViewDidLeave()');
  }
  ionViewWillLeave(){
    console.log('ionViewWillLeave');
  }
  ionViewWillUnload(){
    console.log('ionViewWillUnloadr');
  }
}
