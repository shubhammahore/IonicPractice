import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSuccessPage } from './order-success';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSuccessPage),
    PipesModule
  ],
  providers: []
})
export class OrderSuccessPageModule {}
