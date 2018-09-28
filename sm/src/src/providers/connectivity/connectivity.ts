import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Network
} from '@ionic-native/network';
import {
  Observable
} from 'rxjs/Observable';
import {
  Platform
} from 'ionic-angular';
import {
  Subject
} from 'rxjs/Subject';

declare var navigator: any;

@Injectable()
export class ConnectivityProvider {

  connectivityStatus = new Subject < any > ();
  public isConnected: boolean = true;
  constructor(public network: Network, private platform: Platform, ) {
    this.isConnected = true;
    platform.ready().then(() => {
      let type = this.network.type;

      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        if (navigator.onLine) {
          this.isConnected = true;
          this.connectivityStatus.next(this.isConnected);
        } else {
          this.isConnected = false;
          this.connectivityStatus.next(this.isConnected);
        }
      } else if (type == "unknown" || type == "none" || type == undefined) {

        this.isConnected = false;

        this.connectivityStatus.next(this.isConnected);
      } else {
        this.isConnected = true;

        this.connectivityStatus.next(this.isConnected);
      }

      this.network.onConnect().subscribe(data => {
        this.isConnected = true;

        this.connectivityStatus.next(this.isConnected);
      });
      this.network.onDisconnect().subscribe(data => {
        this.isConnected = false;

        this.connectivityStatus.next(this.isConnected);
      });

    });

  }


}