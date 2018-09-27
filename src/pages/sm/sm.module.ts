import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmPage } from './sm';

@NgModule({
  declarations: [
    SmPage,
  ],
  imports: [
    IonicPageModule.forChild(SmPage),
  ]
})
export class SmPageModule {}
