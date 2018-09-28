import {
  Component,
  OnInit,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Navbar,
  AlertController
} from 'ionic-angular';
import {
  TerminalProvider
} from '../../providers/terminal';
import {
  AccountProvider
} from '../../providers/account';
import {
  Terminal,
  TerminalDetail
} from '../../models/terminal';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  AlertProvider
} from '../../providers/alert';
import {
  LoadingProvider
} from '../../providers/loading';
import {
  ImageViewerController
} from "ionic-img-viewer";
declare var window;

@IonicPage()
@Component({
  selector: 'page-terminal-info',
  templateUrl: 'terminal-info.html',
})
export class TerminalInfoPage implements OnInit {
  @ViewChild('navbar') navBar: Navbar;
  terminal: TerminalDetail = new TerminalDetail();
  currentTerminalId: string;
  isSerachTerminal: boolean;
  images = [];
  user: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private terminalProvider: TerminalProvider,
    private browser: InAppBrowser,
    private accountProvider: AccountProvider,
    public connectivityProvider: ConnectivityProvider,
    private alertCtrl: AlertController,
    private ngZone: NgZone,
    private appState: AppStateProvider,
    private loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public imageViewerCtrl: ImageViewerController) {
    this.currentTerminalId = this.navParams.get('id');
    this.user = this.appState.getUserProfile();
  }

  ngOnInit(): void {

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.connectivityProvider.connectivityStatus.subscribe(res => {

      if (res) {
        this.ngZone.run(() => {
          this.getById(this.currentTerminalId);

        })
      }

    });

    if (this.connectivityProvider.isConnected) {
      this.ngZone.run(() => {
        this.getById(this.currentTerminalId);


      })
    }
  }

  ionViewDidLoad() {

  }

  getById(id: string): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      if (!this.loadingProvider.loading) {
        this.loadingProvider.show('please wait...');
      }
      this.terminalProvider.getById(id).subscribe(res => {
        this.terminal = res;

        this.appState.setTerminal(this.terminal);

        if (res) {
          this.accountProvider.getInfo(this.terminal.AccountId).subscribe(res => {

            this.terminal.Id = res._id.$id;
            this.terminal.MobileNo = res.MobileNo;
            this.terminal.Name = res.BusinessName;
            this.terminal.EmailId = res.EmailId;
            this.terminal.Address = res.Address;
            this.terminal.City = res.City;
            this.terminal.Zip = res.Zip;
            this.terminal.State = res.State;
            this.terminal.Country = res.Country;
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
        }
      }, err => {

        if (this.loadingProvider.loading) {
          this.loadingProvider.hide();
          this.loadingProvider.loading = null;
        }
      });
    }
  }

  sendEmail(email): void {

    email = encodeURIComponent(email);
    window.location = "mailto:" + email;

  }

  sendcall(number): void {
    number = encodeURIComponent(number);
    window.location = "tel:" + number;
  }


  openbrowser(Link: string): void {

    const openbrowser = this.browser.create(Link);
    openbrowser.show();
  }

  goToOrderForm(markNoOrder: boolean): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {

      (this.terminal.FT == 'ST' || this.terminal.FT == 'SS' || (this.terminal.FT == 'ER' && this.terminal.Sections.length > 0)) ? this.navCtrl.push('PlaceOrderPage', {
        MarkNoOrder: markNoOrder
      }): this.navCtrl.push('OrderFormPage', {
        MarkNoOrder: markNoOrder
      });

    }
  }


  onClickImage(imageToView) {
    const viewer = this.imageViewerCtrl.create(imageToView)
    viewer.present();
  }
}
