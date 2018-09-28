import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import {
  DashboardPage
} from '../../pages/dashboard/dashboard';
import {
  ToastProvider
} from '../../providers/toast';
import {
  Subject
} from 'rxjs/Subject';
/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(public http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
    console.log('Hello AlertProvider Provider');
  }


  show(): void {

    let toast = this.toastCtrl.create({
      message: 'Internet Connection Issue,Please Check Your Internet Settings.',
      position: 'top',
      closeButtonText: 'Dismiss',
      showCloseButton: true

    });
    toast.present();
  }


  locationAlert() {
    let alert = this.alertCtrl.create({

      subTitle: 'Please Enable Your GeoLocation.',
      buttons: ['OK'],
    });
    alert.present();
  }

  showSucessProfile(Message: string): void {
    let toast = this.toastCtrl.create({
      message: Message,
      position: 'bottom',
      duration: 3000,

    });
    toast.present();
  }



  ProfileNameAlert() {
    let alert = this.alertCtrl.create({

      subTitle: 'Profile name alrady exist.',
      buttons: ['OK'],
    });
    alert.present();
  }
}
