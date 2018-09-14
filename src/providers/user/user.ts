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
  login(id) {
    return this.storage.get('currentUser').then((response) => {
      if (!response) {
        return this.get(id).then((response) => {
          this.storage.set('currentUser', response);
          this.currentUser = response
          return response 
        })
      } else {
        return response
      }
    });
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    return this.storage.get('currentPosition').then((position) => {
      accountInfo.position = position
      return this.db.put(accountInfo).then((account) => {
        this.storage.set('currentUser', accountInfo).then((response) => {
          this.currentUser = accountInfo
          return response;
        });
      });
    });
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
