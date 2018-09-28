import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderFormPage } from './order-form';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderFormPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderFormPage),
    PipesModule
  ],
})
export class OrderFormPageModule {}
