import {
  Component,
  NgZone,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Navbar
} from 'ionic-angular';

// import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {
  TerminalProvider
} from '../../providers/terminal';
import {
  Terminal,
  TerminalDetail
} from '../../models/terminal';
import {
  LimitPipe
} from '../../pipes/limit/limit';
import * as _ from 'lodash';
import {
  ToastProvider
} from '../../providers/toast';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AlertProvider
} from '../../providers/alert';
import {
  LoadingProvider
} from '../../providers/loading';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  Keyboard
} from '@ionic-native/keyboard';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchPage {
  @ViewChild('navbar') navBar: Navbar;
  terminal: Array < Terminal >= [];
  recentTerminal: Array < Terminal >= [];
  serachTerm = '';
  terminaldata: TerminalDetail;
  currentAccessKey = [];
  overlayHidden: boolean = true;
  terminalAccessKey: number;
  wrioCode: string;
  isKeyboardHide: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public terminalProvider: TerminalProvider,
    private alertCtrl: AlertController,
    private toastProvider: ToastProvider,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    private ngZone: NgZone,
    private keyboard: Keyboard,
    private cdRef: ChangeDetectorRef,
    private loadingProvider: LoadingProvider,
    private appState: AppStateProvider) {
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
    });
  }

  ngOnInit(): void {
    this.connectivityProvider.connectivityStatus.subscribe(res => {

      if (res) {
        this.ngZone.run(() => {
          this.recentSearch();

        })
      }

    });

    if (this.connectivityProvider.isConnected) {
      this.ngZone.run(() => {
        this.recentSearch();
      })
    }
  }

  ionViewCanLeave(): boolean {
    if (!this.overlayHidden) {
      this.overlayHidden = true
      return false
    } else {
      return true
    }
  }



  ionViewDidLoad() {

  }

  /**
   * this method is used to search terminal 
   * @param  {any} ev
   * @returns void
   */
  search(ev: any): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      const val = ev.target.value;
      if (val.length >= 3) {

        this.terminalProvider.serach(val.trim()).subscribe(res => {
            this.ngZone.run(() => {
              this.terminal = res;
            })



          },
          err => {
            console.log(err);

          }
        );
      } else {
        this.terminal = [];
      }
    }
  }


  /**
   * this method is used to display recently terminal order 
   * @returns void
   */
  recentSearch(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      if (!this.loadingProvider.loading) {
        this.loadingProvider.show('please wait...');
      }
      //let userid=Number(localStorage.getItem('userId'));
      let user = this.appState.getUserProfile();
      //3542670831
      this.terminalProvider.getRecentTerminals(user.UserId).subscribe(res => {
        this.recentTerminal = res;

        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
      }, err => {

        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
      })
    }
  }

  hideOverlay() {
    this.terminalAccessKey = null;
    this.overlayHidden = true;
  }

  valueChange(value) {

    this.cdRef.detectChanges();
    this.terminalAccessKey = value.length > 4 ? value.substring(0, 4) : value;

  }

  hideOverlayData() {

    if ((this.terminalAccessKey).toString().length === 4) {

      this.macthAccessKey((this.terminalAccessKey).toString(), this.wrioCode);
      this.overlayHidden = true;
    }
  }



  macthAccessKey(accesskey: string, id): void {

    if (this.terminaldata.TerminalAccessKey == accesskey) {
      let index = this.currentAccessKey.findIndex(obj => obj.Id === id);
      if (index != -1) {
        this.currentAccessKey[index].Key = accesskey;
      } else {
        this.currentAccessKey.push({
          'Id': this.terminaldata.WrioCode,
          'Key': accesskey

        });
      }
      this.appState.setAccesToken(this.currentAccessKey);
      this.navCtrl.push('TerminalInfoPage', {
        id: id
      });
    } else {
      this.toastProvider.show('Wrong Access Key');
    }

  }

  goToDetailPage(wiroid: string): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.navCtrl.push('TerminalInfoPage', {
        id: wiroid
      });
    }
  }


  goToDisplayPage(status: string, WrioCode: string, IsPrivate: boolean): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {

      if (status === 'ON') {

        if (IsPrivate == false) {

          this.navCtrl.push('TerminalInfoPage', {
            id: WrioCode
          });

        } else if (IsPrivate == true) {
          this.terminalProvider.getById(WrioCode).subscribe(res => {
            this.terminaldata = res;
          })
          this.currentAccessKey = this.appState.getAccesToken();
          let index = this.currentAccessKey.findIndex(obj => obj.Id === this.terminaldata.WrioCode && obj.Key != this.terminaldata.TerminalAccessKey);
          if (!this.currentAccessKey.length || index != -1) {
            this.wrioCode = WrioCode;
            this.overlayHidden = false;

          } else {
            this.navCtrl.push('TerminalInfoPage', {
              id: WrioCode
            });
          }
        }
      } else if (status == 'OFF') {
        //  to do show alrt

        let alert = this.alertCtrl.create({
          subTitle: 'Currently this terminal is closed',
          buttons: ['OK'],
        });
        alert.present();



      }
    }
  }
}
