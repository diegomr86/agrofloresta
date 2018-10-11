import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Database } from '../database/database';

@Injectable()
export class User extends Database {

  currentUser;
  showTour;

  constructor(public storage: Storage) { 
    super();
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(email) {
    return this.query('user', '', { email: email }).then((res) => {
      if (res && res.length > 0) {
        this.storage.set('currentUser', res[0]);
        this.currentUser = res[0]
        return res[0]
      }        
      throw {name: "not_found"};  
    })
  }

  put(item) {
    return this.db.put(item).then((account) => {
      return this.db.get(account.id).then((u) => {
        return this.storage.set('currentUser', u).then((response) => {
          this.currentUser = u
          return u;
        });
      });
    });
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    return this.login(accountInfo.email).catch((e) => {
      return this.storage.get('currentPosition').then((position) => {
        accountInfo.position = position
        return this.db.post(accountInfo).then((account) => {
          this.storage.set('currentUser', accountInfo).then((response) => {
            this.currentUser = accountInfo
            return response;
          });
        });
      });
    })

  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.currentUser = undefined
    // this.storage.remove('skipTour')
    return this.storage.remove('currentUser')
  }

  getCurrentUser() {
    return this.storage.get('currentUser').then((response) => {
      this.currentUser = response
      return response
    })  
  }

  skipTour() {
    return this.storage.get('skipTour').then((response) => {
      return response
    })   
  }

  setSkipTour(skipTour) {
    this.storage.set('skipTour', skipTour).then((response) => {
      return response
    })   
  }

}
