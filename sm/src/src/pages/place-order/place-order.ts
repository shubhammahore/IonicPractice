import * as _ from 'lodash';

import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  TerminalDetail,
  Item
} from '../../models/terminal';
import {
  AppStateProvider
} from '../../providers/app-state';
import {
  ConnectivityProvider
} from '../../providers/connectivity';
import {
  AlertProvider
} from '../../providers/alert';
import {
  FormControl
} from '@angular/forms';
import {
  AlertController,
  Navbar
} from 'ionic-angular';

/**
 * Generated class for the PlaceOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place-order',
  templateUrl: 'place-order.html',
})
export class PlaceOrderPage {
  @ViewChild('navbar') navBar: Navbar;
  note: any = '';
  itemTerm = '';
  parent: Array < any >= [];
  terminal: TerminalDetail;
  comment: string;
  count = 0;
  sectionObj = {
    items1: [],
    total: 0,
    CurrencySymbol: '',
    Comment: ''
  };
  getNotes = [];
  prevId = '';
  toggleview = false;
  searchItemsDataDisplay = [];
  searchItemsData = [];
  searchControl: FormControl;
  locStorageNote: string;
  currentNote = [];
  marknoOrder: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    public alertProvider: AlertProvider,
    private appStateProvider: AppStateProvider,
    public connectivityProvider: ConnectivityProvider,
    private alertCtrl: AlertController
  ) {
    this.searchControl = new FormControl();
    this.marknoOrder = this.navParams.get('MarkNoOrder');
    this.getTerminal();
    localStorage.removeItem('note');
  }


  ionViewDidLoad(): void {

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      this.setFilteredItems();

    });

    this.navBar.backButtonClick = () => {
      ///here you can do wathever you want to replace the backbutton event
      if (!this.connectivityProvider.isConnected) {
        this.alertProvider.show();
      } else {
        let confirm = false;
        if (this.sectionObj.total !== 0) {
          let alert = this.alertCtrl.create({
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
          alert.present();
          alert.onDidDismiss(() => {
            if (confirm) {
              this.navCtrl.pop();
            }
          })
        } else {
          this.navCtrl.pop();
        }
      }
    };
  }

  ionViewCanLeave(): boolean {
    if (this.toggleview) {
      this.toggleItemView();
      return false
    } else {
      return true
    }
  }

  getTerminal(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      const localThis = this;
      this.terminal = this.appStateProvider.getTerminal();
      this.sectionObj.CurrencySymbol = this.terminal.CurrencySymbol;
      _.forEach(localThis.terminal.Sections, (section) => {
        _.forEach(section.Items, (item) => {
          let tempItem = {
            Id: item.Id,
            SectionId: section.SectionID,
            FN: item.FN,
            Price: item.Price,
            Image: item.Image,
            UnitOfSale: item.UnitOfSale,
            QTY: item.QTY
          };
          localThis.searchItemsData.push(tempItem);
        });
      });
    }

    this.setFilteredItems();
  }


  toggleSection(i: number): void {
    this.terminal.Sections[i].Visible = !this.terminal.Sections[i].Visible;
  }
  /**
   * this method is used to add and remove  quntity for perticular items
   * @param  {number} sectionIndex
   * @param  {number} itemIndex
   * @param  {string} itemId
   * @param  {string} key
   * @param  {boolean} onHoldForm
   * @param  {string} note?
   * @param  {number} qty?
   * @returns void
   */
  itemCount(sectionIndex: number, itemIndex: number, itemId: string, key: string, onHoldForm: boolean, note ? : string, qty ? : number): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {
      let searchItemIndex = this.searchItemsDataDisplay.findIndex(item => item.Id === itemId);
      this.searchItemsDataDisplay[searchItemIndex]['Note'] = note;


      if (key == 'plus') {
        if (onHoldForm === true) {

          let price = this.searchItemsDataDisplay[searchItemIndex].QTY * this.terminal.Sections[sectionIndex].Items[itemIndex].Price;
          this.terminal.Sections[sectionIndex].SectionTotal -= price;
          this.sectionObj.total -= price;
          this.searchItemsDataDisplay[searchItemIndex].QTY = qty;
          this.terminal.Sections[sectionIndex].Items[itemIndex].QTY = qty;
          this.terminal.Sections[sectionIndex].SectionTotal += (qty * this.terminal.Sections[sectionIndex].Items[itemIndex].Price);
          this.sectionObj.total += (qty * this.terminal.Sections[sectionIndex].Items[itemIndex].Price);

        } else {
          this.searchItemsDataDisplay[searchItemIndex].QTY += 1;
          this.terminal.Sections[sectionIndex].Items[itemIndex].QTY += 1;
          this.terminal.Sections[sectionIndex].SectionTotal += this.terminal.Sections[sectionIndex].Items[itemIndex].Price;
          this.sectionObj.total += this.terminal.Sections[sectionIndex].Items[itemIndex].Price;

        }


        if (this.sectionObj.items1.length) {

          let obj = this.sectionObj.items1.find(obj => obj.Id === this.terminal.Sections[sectionIndex].Items[itemIndex].Id);

          //   this.sectionObj.items1[index].QTY +=1;
          if (obj) {
            // this.sectionObj.items1[].QTY +=1;

            this.setNotes(note, sectionIndex, itemIndex);

          } else {
            this.sectionObj.items1.push(this.terminal.Sections[sectionIndex].Items[itemIndex]);

            this.setNotes(note, sectionIndex, itemIndex);
            localStorage.setItem('totalItems', JSON.stringify(this.sectionObj.items1.length));

          }
        } else {
          this.sectionObj.items1.push(this.terminal.Sections[sectionIndex].Items[itemIndex]);
          localStorage.setItem('totalItems', JSON.stringify(this.sectionObj.items1.length));
          this.setNotes(note, sectionIndex, itemIndex);
        }

      } else {
        this.searchItemsDataDisplay[searchItemIndex].QTY -= 1;
        this.terminal.Sections[sectionIndex].Items[itemIndex].QTY -= 1;
        this.terminal.Sections[sectionIndex].SectionTotal -= this.terminal.Sections[sectionIndex].Items[itemIndex].Price;
        this.sectionObj.total -= this.terminal.Sections[sectionIndex].Items[itemIndex].Price;
        // this.sectionObj.items1.splice(itemindex, 1);
        let obj = this.sectionObj.items1.find(obj => obj.Id === this.terminal.Sections[sectionIndex].Items[itemIndex].Id);
        //   this.sectionObj.items1[index].QTY +=1;
        if (obj.QTY === 0) {
          // this.sectionObj.items1[].QTY +=1;
          let index = this.sectionObj.items1.findIndex(obj => obj.Id === this.terminal.Sections[sectionIndex].Items[itemIndex].Id);
          this.sectionObj.items1.splice(index, 1);
          localStorage.setItem('totalItems', JSON.stringify(this.sectionObj.items1.length));
        }
      }
    }
  }

  navigateTO(): void {
    if (!this.connectivityProvider.isConnected) {
      this.alertProvider.show();
    } else {

      if (this.terminal.AskComment == 'Y') {
        let alert = this.alertCtrl.create({

          subTitle: this.terminal.CommentMessage,
          buttons: [{
              text: 'No',
              handler: data => {

                if (this.terminal.OrderAssure == true) {
                  this.showAssureMessage();
                } else {
                  this.showZeroItemMessage();
                }
              }
            },
            {
              text: 'Yes',
              handler: data => {
                this.commentBox();
              }
            }
          ]
        });
        alert.present();

      } else {
        this.showZeroItemMessage();
      }
    }
  }


  commentBox() {
    const prompt = this.alertCtrl.create({

      inputs: [{
          name: 'comment',
          placeholder: 'Enter Your comment here',

        },


      ],
      buttons: [{
          text: 'CANCEL',
          handler: data => {

            if (this.terminal.OrderAssure == true) {
              this.showAssureMessage();
            } else {
              this.showZeroItemMessage();
            }
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.sectionObj.Comment = data.comment;
            if (this.terminal.OrderAssure == true) {
              this.showAssureMessage();
            } else {
              this.showZeroItemMessage();
            }
          }
        },
      ]
    });
    prompt.present();
  }

  showAssureMessage() {
    let alert = this.alertCtrl.create({

      subTitle: this.terminal.OrderAssureMessage,
      buttons: [{
          text: 'CANCEL',
          handler: data => {

          }
        },
        {
          text: 'I AGREE',
          handler: data => {
            this.showZeroItemMessage();
          }
        }
      ]
    });
    alert.present();



  }

  showZeroItemMessage() {
    if (this.sectionObj.total == 0) {
      let alert = this.alertCtrl.create({

        subTitle: 'Payment Amount Should not be 0 ',
        buttons: ['OK'],
      });
      alert.present();
    } else {
      this.appStateProvider.setSessionItem(this.sectionObj)
      JSON.parse(localStorage.getItem('note')) ? JSON.parse(localStorage.getItem('note')) : [];
      this.terminal.FT == 'AA' ? this.navCtrl.push('BookAppointmentPage') : (this.terminal.FT == 'ST' || this.terminal.FT == 'ER' || this.terminal.FT == 'SS') ? this.navCtrl.push('OrderFormPage', {
        MarkNoOrder: this.marknoOrder
      }) : this.navCtrl.push('ConfirmOrderPage');
    }
  }
  toggleItemView(): void {
    this.toggleview = !this.toggleview;
  }

  searchItemCount(sectionID: string, itemId: string, key: string, onHoldForm: boolean, note ? : string, qty ? : number): void {

    let sectionIndex = this.terminal.Sections.findIndex(obj => obj.SectionID === sectionID);
    let itemIndex = this.terminal.Sections[sectionIndex].Items.findIndex(obj => obj.Id === itemId);

    this.itemCount(sectionIndex, itemIndex, itemId, key, onHoldForm, note, qty);

  }

  setFilteredItems(): void {

    this.searchItemsDataDisplay = this.searchItem(this.itemTerm);

  }

  searchItem(term: string): Array < any > {
    return this.searchItemsData.filter(obj => obj.FN.toLowerCase().indexOf(term.toLowerCase()) > -1);
  }
  navigateToItemDetail(item: Item): void {
    this.navCtrl.push('ItemdetailsPage', {
      sectionitem: item
    })
  }


  showPromptSetQyt(sectionIndex: number, itemIndex: number, itemId: string, key: string, onHoldForm: boolean, qty: number, isSearch: boolean, sectionID ? : string) {
    if (this.terminal.FT != 'AA') {
      if (sectionIndex == -1 && itemIndex == -1) {
        sectionIndex = this.terminal.Sections.findIndex(obj => obj.SectionID === sectionID);
        itemIndex = this.terminal.Sections[sectionIndex].Items.findIndex(obj => obj.Id === itemId);
      }

      this.getNotes = JSON.parse(localStorage.getItem('note')) ? JSON.parse(localStorage.getItem('note')) : [];
      if (this.getNotes.length > 0) {
        let indexnote = this.getNotes.findIndex(obj => obj.Id === this.terminal.Sections[sectionIndex].Items[itemIndex].Id);
        if (indexnote != -1) {
          this.locStorageNote = this.getNotes[indexnote].Key;

        } else {
          this.locStorageNote = '';
        }
      }

      const prompt = this.alertCtrl.create({

        inputs: [{
            name: 'quantity',
            placeholder: 'Enter Quantity',
            type: 'number',
            value: qty.toString(),
            label: 'Enter Quantity',
          },

          {
            name: 'notes',
            value: this.locStorageNote,
            placeholder: 'Notes'
          },
        ],
        buttons: [{
            text: 'CANCEL',
            handler: data => {

            }
          },
          {
            text: 'SET',
            handler: data => {
              (isSearch) ? this.searchItemCount(sectionID, itemId, key, onHoldForm, data.notes, Number(data.quantity)):
                this.itemCount(sectionIndex, itemIndex, itemId, key, onHoldForm, data.notes, Number(data.quantity));
            }
          }
        ]
      });
      prompt.present();
    }
  }
  setNotes(note: string, sectionIndex: number, itemIndex: number): void {
    let searchItemIndex = this.searchItemsDataDisplay.findIndex(item => item.Id === this.terminal.Sections[sectionIndex].Items[itemIndex].Id);

    let index = this.sectionObj.items1.findIndex(obj => obj.Id === this.terminal.Sections[sectionIndex].Items[itemIndex].Id);
    this.sectionObj.items1[index]['Note'] = note;
    this.currentNote = this.appStateProvider.getNotes();

    let indexnote = this.currentNote.findIndex(obj => obj.Id === this.sectionObj.items1[index].Id);
    if (indexnote != -1) {
      if (note || note == '') {
        this.currentNote[indexnote].Key = note;
        this.terminal.Sections[sectionIndex].Items[itemIndex]['Note'] = note;
        this.searchItemsDataDisplay[searchItemIndex]['Note'] = note;
      } else {
        this.terminal.Sections[sectionIndex].Items[itemIndex]['Note'] = this.currentNote[indexnote].Key;
        this.searchItemsDataDisplay[searchItemIndex]['Note'] = this.currentNote[indexnote].Key;
      }
    } else if (note) {
      this.currentNote.push({
        'Id': this.sectionObj.items1[index].Id,
        'Key': note
      });
      this.terminal.Sections[sectionIndex].Items[itemIndex]['Note'] = note;
      this.searchItemsDataDisplay[searchItemIndex]['Note'] = note;



    }
    this.appStateProvider.setNotes(this.currentNote);

  }

  ionViewDidLeave() {
    // localStorage.removeItem('note');
    localStorage.removeItem('totalItems');
  }

}
