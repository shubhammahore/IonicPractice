import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmOrderPage } from './confirm-order';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    ConfirmOrderPage
   
  ],
  imports: [
    IonicPageModule.forChild(ConfirmOrderPage),
    PipesModule
  ],
  
})
export class ConfirmOrderPageModule {}
