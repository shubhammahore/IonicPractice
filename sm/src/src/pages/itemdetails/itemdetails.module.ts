import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemdetailsPage } from './itemdetails';

@NgModule({
  declarations: [
    ItemdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemdetailsPage),
  ],
})
export class ItemdetailsPageModule {}
