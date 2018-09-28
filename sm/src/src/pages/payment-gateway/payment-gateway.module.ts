import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentGatewayPage } from './payment-gateway';

@NgModule({
  declarations: [
    PaymentGatewayPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentGatewayPage),
  ],
})
export class PaymentGatewayPageModule {}
