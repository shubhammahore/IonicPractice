import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerminalInfoPage } from './terminal-info';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TerminalInfoPage,
    
  ],
  imports: [
    IonicPageModule.forChild(TerminalInfoPage),
    PipesModule
   
    
  ],
  providers:[  
      InAppBrowser,
    
  ]


})
export class CompanyInfoPageModule {}
