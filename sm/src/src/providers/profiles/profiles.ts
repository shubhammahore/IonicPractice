import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable,
  Subject
} from 'rxjs';
import {
  environment
} from '../../environments/environment';
import {
  SQLite,
  SQLiteObject
} from '@ionic-native/sqlite';
import {
  Profile
} from '../../models/profile';
import * as _ from 'lodash';
import {
  Any
} from 'typeorm';
import {
  ProfileName
} from 'aws-sdk/clients/alexaforbusiness';
/*
  Generated class for the ProfilesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfilesProvider {
  mainprofile: Array < Profile >= [];
  public CreatProfileRes = new Subject < Number > ();
  profileData = new Profile();
  IsProfile: boolean = false;
  constructor(public http: HttpClient, private sqlite: SQLite) {

  }


  //Methods of Profile from server.
  getProfiles(userId: number): Observable < any > {

    const url = `${environment.apiUrl}ClientFunctions.php?function=GetProfile&UserId=${userId}`;
    return this.http.get < any > (url).catch(this.serverError);
  }



  Post(InfoArray: any): Observable < any > {
    const url = `${environment.apiUrl}saveprofileAPI_dev.php`;
    let body = new FormData();
    body.append('InfoArray', JSON.stringify(InfoArray));
    return this.http.post < any > (url, body).catch(this.serverError);
  }


  update(InfoArray: any, ProfileId: any, UserId: any): Observable < any > {
    const url = `${environment.apiUrl}updateprofileAPI_dev.php`;
    let body = new FormData();

    body.append('InfoArray', JSON.stringify(InfoArray));
    body.append('Id', ProfileId);
    body.append('UserId', UserId);
    return this.http.post < any > (url, body).catch(this.serverError);
  }




  //  //Methods of Profile and create SqliteDb for profile (localServer).

  createProfileDb(profiles): Observable < any > {
    this.sqlite.create({
      name: 'ProfileDb.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {

      db.executeSql('DROP TABLE IF EXISTS Profiles', []).then(res => {

        db.executeSql('CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,ProfileId text,Isdefault text,Data text,ProfileName text,Image text)', [])
          .then(res => {

            if (profiles) {
              const profileQueries: string[] = profiles.map(profile => `INSERT INTO Profiles (ProfileId,Isdefault,Data,ProfileName,Image) values('${profile._id.$id}', '${profile.Default}','${JSON.stringify(profile).replace(/'/g, "''")}',"${profile.ProfileName.replace(/'/g, "''")}","${profile.Image}")`);

              db.sqlBatch(profileQueries).then(res => {

                db.executeSql('select * from Profiles', []).then((data) => {

                  this.CreatProfileRes.next(data.rows.length);


                }, (err) => {
                  console.log('Unable to execute sql: ' + JSON.stringify(err));

                });

              }, (err) => {
                console.log('Unable to execute sql: ' + JSON.stringify(err));
              });

            } else {
              this.CreatProfileRes.next(0);
            }
          })
          .catch(e => console.log(e));

      })



    })
    .catch(e => console.log('profileerror', JSON.stringify(e)));

    return this.CreatProfileRes.asObservable()
  }
createUserLogin(userId:number){
  
  this.sqlite.create({
    name: 'ProfileDb.db',
    location: 'default'
  })
  .then((db: SQLiteObject) => {
    
    db.executeSql('DROP TABLE IF EXISTS UserLogin', []).then(res => {

      db.executeSql('CREATE TABLE IF NOT EXISTS UserLogin(id INTEGER PRIMARY KEY AUTOINCREMENT,UserId INTEGER,IsUserLogin NUMERIC)', [])
        .then(res => {
          debugger;
          db.executeSql(`INSERT INTO UserLogin(UserId,IsUserLogin)values(${userId},'True')`,[])
          .then(res => {
            debugger;
            db.executeSql('select * from UserLogin', []).then((data) => {
              debugger;
                    console.log('userlogin',data.rows.length);
                    
                    console.log('userlogindetail',data.rows.item(0).UserId,data.rows.item(0).IsUserLogin)
            })
          },(err) => {
            console.log('userloginerror: ' + JSON.stringify(err));
           
          })
        })
      })
  
})
}

IsUserLogin(UserId: any) {
  return new Promise((resolve, reject) => {
    this.sqlite.create({
        name: 'ProfileDb.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {

        db.executeSql(`select * from UserLogin where UserId=${UserId}`, []).then((data) => {

          this.mainprofile = new Array < Profile > ();
          if (data.rows.length > 0) {
            return resolve(data.rows.item(0).IsUserLogin);
          }else{
            return resolve(false);
          }


        }, (err) => {
          resolve(false);
          console.log('Unable to execute sql: ' + JSON.stringify(err));
        });
      })
  })
}

dropUserLogin(){
  this.sqlite.create({
    name: 'ProfileDb.db',
    location: 'default'
  })
  .then((db: SQLiteObject) => {
    
    db.executeSql('DROP TABLE IF EXISTS UserLogin', []).then(res => {

    })
  })
}






  getProfilelocal(profileId: any) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
          name: 'ProfileDb.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {

          db.executeSql(`select * from Profiles where ProfileId='${profileId}'`, []).then((data) => {

            this.mainprofile = new Array < Profile > ();
            if (data.rows.length > 0) {


              let profileData = new Profile();
              profileData.Id = data.rows.item(0).id;
              profileData.IsDefault = data.rows.item(0).Isdefault;
              profileData.ProfileId = data.rows.item(0).ProfileId;
              profileData.Data = data.rows.item(0).Data;
              profileData.Image = data.rows.item(0).Image;
              profileData.ProfileName = data.rows.item(0).ProfileName;


              return resolve(profileData);
            }


          }, (err) => {
            resolve(this.mainprofile);
            console.log('Unable to execute sql: ' + JSON.stringify(err));
          });
        })
    })



  }


  saveProfileLocal(profileData: Profile): any {
    this.sqlite.create({
        name: 'ProfileDb.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql(`INSERT INTO Profiles (ProfileId,Isdefault,Data,ProfileName,Image) values('${profileData.ProfileId}', '${profileData.IsDefault}','${JSON.stringify(profileData.Data)}','${profileData.ProfileName}','${profileData.Image}')`, []).then((data) => {


        }, (err) => {

          console.log('Unable to execute sql: ' + JSON.stringify(err));
        });
      })
    return this.mainprofile;
  }



  updateProfileLocal(profileData: Profile): any {
    this.sqlite.create({
        name: 'ProfileDb.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql(`update  Profiles set Isdefault='${profileData.IsDefault}',Data='${JSON.stringify(profileData.Data)}',ProfileName="${profileData.ProfileName}",Image="${profileData.Image}" where ProfileId="${profileData.ProfileId}"`).then((data) => {

        }, (err) => {

          console.log('Unable to execute sql: ' + JSON.stringify(err));
        });
      })
    return this.profileData;
  }






  getProfileLocalByName(profileName: string) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
          name: 'ProfileDb.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql(`select * from  Profiles where lower(ProfileName)=lower('${profileName}')`, []).then((data) => {

            if (data.rows.length > 0) {
              this.IsProfile = true;
              return resolve(this.IsProfile);
            } else {
              this.IsProfile = false;
              return resolve(this.IsProfile);
            }

          }, (err) => {

            console.log('Unable to execute sql: ' + JSON.stringify(err));
            return resolve(this.IsProfile);
          });
        })
    })
  }









  /**
   * This method is used to return server error
   * @param  {any} err
   */
  private serverError(err: any) {
    if (err) {
      return Observable.throw(err);
    }
    return Observable.throw(err || 'Server error');
  }
}
