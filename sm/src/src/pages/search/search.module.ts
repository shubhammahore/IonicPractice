import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import{PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchPage

  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SearchPage),
  ],
  providers:[
    // BarcodeScanner

  ]
})
export class SearchPageModule {}
