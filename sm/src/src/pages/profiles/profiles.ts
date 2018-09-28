import { AppStateProvider } from './../../providers/app-state/app-state';
import { Profile } from './../../models/profile/profile.model';
import { ProfilesProvider } from './../../providers/profiles/profiles';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ProfilePopoverPage } from '../profile-popover/profile-popover';


/**
 * Generated class for the ProfilesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profiles',
  templateUrl: 'profiles.html',
})
export class ProfilesPage {

  user: any;
  profileList: Array<Profile> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private profilesProvider : ProfilesProvider,  private appState: AppStateProvider, public popoverCtrl: PopoverController) {
    this.user = this.appState.getUserProfile();
  }

  ngOnInit(): void {
    this.getProfilesofUser();
  }

  ionViewDidLoad() {
  
  }

  getProfilesofUser() {
    this.profilesProvider.getProfiles(this.user.UserId).subscribe(res => {
      // debugger;
      // console.log('viewlog',res);
    
      this.profileList = res;
   
       console.log('profiles',this.profileList);
    });
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ProfilePopoverPage);
    popover.present({
      ev: myEvent
    });
  }
}

