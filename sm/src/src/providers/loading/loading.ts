
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

  loading: any;

  constructor(public loadingCtrl: LoadingController) {
    
  }


  show(content: string): void {
    this.loading = this.loadingCtrl.create({
      content: content,
      spinner: 'bubbles'
    });
    this.loading.present();
  }

  hide(): void {
    this.loading.dismiss();
  }
}
