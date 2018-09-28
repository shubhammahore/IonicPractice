import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastProvider {

  constructor(public toastCtrl: ToastController) {
  }

  show(message: any, duration?: number) {

    const toast = this.toastCtrl.create({
      message: message,
      duration: (duration)? duration:3000,
      position: 'top',
      
    });
    toast.present();
  }



  showdashboard(message: any, duration?: number) {

    const toast = this.toastCtrl.create({
      message: message,
      duration: (duration)? duration:3000,
      position: 'bottom',
     
    });
    toast.present();
  }
}
