import { ViewLog } from './../../models/viewlog/viewlog.model';
import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController
} from 'ionic-angular';
import {
  TerminalProvider
} from '../../providers/terminal';
import {
  onErrorResumeNext
} from 'rxjs/observable/onErrorResumeNext';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  LimitPipe
} from '../../pipes/limit/limit';
import {
  Terminal
} from '../../models/terminal';
import {
  LoadingProvider
} from '../../providers/loading';
import {
  AlertProvider
} from '../../providers/alert';
import * as _ from 'lodash';
import {
  ToastProvider
} from '../../providers/toast';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  Platform,
  App,
  ToastController
} from 'ionic-angular';
import {
  Keyboard
} from '@ionic-native/keyboard';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardPage implements OnInit {

  terminal: Array < Terminal >= [];
  isTerminal: boolean;
  hidden: boolean = false;
  currentAccessKey = [];
  terminaldata: Terminal;
  accessstatus: boolean;
  currentTerminalId: string;
  userProfile: any;
  isKeyboardHide: boolean = true;
  terminalAccessKey: number;
  wrioCode: string;
  overlayHidden: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public terminalProvider: TerminalProvider,
    public connectivityProvider: ConnectivityProvider,
    public alertProvider: AlertProvider,
    private ngZone: NgZone,
    private keyboard: Keyboard,
    private toastCtrl: ToastController,
    private loadingProvider: LoadingProvider,
    private appState: AppStateProvider,
    private toastProvider: ToastProvider,
    private alertCtrl: AlertController,
    private cdRef: ChangeDetectorRef,
    public platform: Platform, public app: App) {
    //this.user = this.appState.getUserProfile();
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
    });
  }

  ngOnInit(): void {

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.userProfile = this.appState.getUserProfile();
    let toast = this.toastCtrl.create({
      message: 'Congratulation your phone number is verified successfully',
      duration: 3000,
      position: 'top',
    })

    toast.present();

    toast.onDidDismiss(() => this.toastProvider.show(`welcome ${this.userProfile.UserName}`))
    this.connectivityProvider.connectivityStatus.subscribe(res => {
      if (res) {
        this.ngZone.run(() => {
          this.getall();
        })
      }

    });

    if (this.connectivityProvider.isConnected) {

      this.ngZone.run(() => {
        this.getall();
      })
    }

    this.platform.ready().then(() => {

      this.platform.registerBackButtonAction(() => {
        let currentnav: any = this.app.getActiveNavs()[0];
        let priviousPage = localStorage.getItem('PageName');
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        } else {
          if (!this.connectivityProvider.isConnected) {
            this.alertProvider.show();
          } else if (currentnav.canGoBack() && priviousPage && (priviousPage === 'OrderSuccessPage' || priviousPage === 'PaymentGateWay')) {
            if (priviousPage === 'PaymentGateWay') {
              let confirm = false;
              let alert = this.alertCtrl.create({

                subTitle: "Do you want to cancel this order and go back?",

                buttons: [{
                    text: 'No',
                    role: 'cancel'
                  },
                  {
                    text: 'Yes',
                    handler: data => {
                      confirm = true;
                    }
                  }
                ]
              });
              alert.present();
              alert.onDidDismiss(() => {
                if (confirm) {
                  localStorage.removeItem('PageName');
                  currentnav.popToRoot();
                }
              })
            } else { //Can we go back?
              localStorage.removeItem('PageName');
              currentnav.popToRoot();
            }
          } else if (currentnav.canGoBack() && !priviousPage && Number(localStorage.getItem('totalItems'))) {
            if (Number(localStorage.getItem('totalItems')) !== 0) {
              let confirm = false;
              let alertForm = this.alertCtrl.create({
                subTitle: 'Do you want to cancel this form and go back',
                buttons: [{
                    text: 'No',
                    role: 'cancel'
                  },
                  {
                    text: 'Yes',
                    handler: data => {
                      confirm = true;
                    }
                  }
                ]
              });
              alertForm.present();
              alertForm.onDidDismiss(() => {

                if (confirm) {
                  localStorage.removeItem('totalItems');
                  this.navCtrl.pop();
                }
              })
            }
          } else if (currentnav.canGoBack() && !priviousPage && !localStorage.getItem('totalItems')) {
            this.navCtrl.pop();
          } else if (!currentnav.canGoBack()) {
            this.platform.exitApp();
          }
        }
      })
    })
  }

  ionViewDidEnter(): void {
    this.getall();
  }

  /**
   * this method is used to get all terminals
   * @returns void
   */
  getall(): void {
    if (!this.loadingProvider.loading) {
      this.loadingProvider.show('please wait...');
    }
    if (this.userProfile.UserRole == 'CU') {
      this.terminalProvider.getall().subscribe(res => {
        //this.terminal= _.filter(res, function(o) { return o.TermType!='BB' && o.Status=='ON'; });
        this.terminal = _.filter(res, function (o) {
          return o.Status == 'ON';
        });

        this.hidden = true;
        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
      }, err => {

        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
      });
    } else {

      let user = this.appState.getUserProfile();
      this.terminalProvider.getRecentTerminals(user.UserId).subscribe(res => {
        this.terminal = _.filter(res, function (o) {
          return o.Status == 'ON';
        });

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

  search(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.navCtrl.push('SearchPage');
    }
  }

  viewLogs(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.navCtrl.push('ViewlogPage');
    }
  }

  viewProfiles(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.navCtrl.push('ProfilesPage');
    }
  }

  /**
   * This method is used to get terminal information for perticular terminal and navigate to terminal info page
   * @param  {string} id
   * @returns void
   */
  goToTerminalInfo(id: string): void {

    this.currentTerminalId = id;
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      this.terminaldata = this.terminal.find(x => x.WrioCode == id);
      if (this.terminaldata.IsPrivate && this.terminaldata.Status == 'ON') {
        this.currentAccessKey = JSON.parse(localStorage.getItem('accesskey')) ? JSON.parse(localStorage.getItem('accesskey')) : [];
        let index = this.currentAccessKey.findIndex(obj => obj.Id === this.terminaldata.WrioCode && obj.Key != this.terminaldata.TerminalAccessKey);
        if (!this.currentAccessKey.length || index != -1) {
          this.wrioCode = id;
          this.overlayHidden = false;


        } else {
          this.navCtrl.push('TerminalInfoPage', {
            id: id
          });
        }
      } else {
        this.navCtrl.push('TerminalInfoPage', {
          id: id
        });
      }

    }
  }

  /**
   * this method is used to check  private terminal access key properly  macth or not 
   * @param  {string} accesskey
   * @param  {} id
   * @returns void
   */
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

}
