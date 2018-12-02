import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import DeltaPouch from 'delta-pouch';
import WebSqlPouchCore from 'pouchdb-adapter-cordova-sqlite';
import { Item } from '../../models/item';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

PouchDB.plugin(DeltaPouch);
PouchDB.plugin(PouchFind);
PouchDB.plugin(WebSqlPouchCore);

@Injectable()
export class Database {
  
  public db; 
  public remote; 
  public cycles;
  public stratums;
  public additional_fields;
  public currentUser;
  public showTour;
  public syncSuccess;

  constructor(public storage: Storage, public plt: Platform) { 
    
    this.syncSuccess = false
    
    this.cycles = {
        placenta1: 'Placenta 1 (Até 3 meses)',
        placenta2: 'Placenta 2 (3 meses a 1 ano)',
        secundaria1: 'Secundária 1 (1 a 10 anos)',
        secundaria2: 'Secundária 2 (10 a 25 anos)',
        secundaria3: 'Secundária 3 (25 a 50 anos)',
        climax: 'Climax (Mais de 50 anos)' }

    this.stratums = {
      baixo: 'Baixo',
      medio: 'Médio',
      alto: 'Alto',
      emergente: 'Emergente' };

  }

  sync() {
    console.log("platform", this.plt.is('android'));
    if (this.plt.is('android')) {
      this.db = new PouchDB('agrofloresta-local', { adapter: 'cordova-sqlite', location:'default', androidDatabaseProvider: 'system' });
    } else {
      this.db = new PouchDB('agrofloresta-local');
    }

    // this.remoteDb = new PouchDB('https://agrofloresta.diegomr86.ga:6984/agrofloresta-prod')
    this.remote = 'https://23bf9857-dbb4-4bc1-bc27-9413f91dfe3b-bluemix.cloudant.com/agrofloresta';
 
    let options = {
      auth: {
        username: "23bf9857-dbb4-4bc1-bc27-9413f91dfe3b-bluemix",
        password: "0ae78ba4ae29a03231d943f56d5408346f46ffd7dfde57f73accdc64a4d76578"
      }
    };

    let that = this
    this.db.sync(this.remote, options).on('complete', function () {

      console.log('DB sync first complete!');
      options['live'] = true
      options['retry'] = true
      options['continuous'] = true

      that.db.sync(that.remote, options).on('change', function (info) {
        console.log('DB sync change: ', info);
      }).on('paused', function (err) {
        console.log('DB sync paused: ', err);
      }).on('active', function () {
        console.log('DB sync active');
      }).on('denied', function (err) {
        console.log('DB sync denied: ', err);
      }).on('complete', function (info) {
        console.log('DB sync complete: ', info);
      }).on('error', function (err) {
        console.log('DB sync error: ', err);
      });;

      that.syncSuccess = true;

    }).on('error', function (err) {
      console.log('DB sync error: ', err);
    });

  } 

  query(type: string, name?: string, filters?) {

    let selector = { type: {$eq: type} }
    if (name) {
      selector[(type == 'post' ? 'title' : 'name')] = {$regex: RegExp(name, "i")}
    }
    if (filters) {
      Object.keys(filters).forEach((key) => {
        console.log(key, filters[key]);
        if (filters[key]) {
          selector[key] = { $eq: filters[key] }
        }
      })
    }
    console.log('query: sel '+JSON.stringify(selector));
    console.log('query: index '+JSON.stringify(Object.keys(selector)));

    let that = this

    return this.db.createIndex({
      index: {
        fields: Object.keys(selector)
      }
    }).then(function (result) {
      return that.db.find({
        selector: selector
      }).then(res => {

        return that.formatDocs(res);

      }); 
    }).catch(function (err) {
      console.log('query: index error: '+JSON.stringify(err, Object.getOwnPropertyNames(err)));
    });

       
  }

  formatDocs(res) {
    console.log('query: res length: '+JSON.stringify(res.docs.length));
    var docs = {},
    deletions = {};
    res.docs.forEach(function (doc) {

      if (!doc.$id) { // first delta for doc?
        doc.$id = doc._id;
      }
      if (doc.$deleted) { // deleted?
        delete(docs[doc.$id]);
        deletions[doc.$id] = true;
      } else if (!deletions[doc.$id]) { // update before any deletion?
        if (docs[doc.$id]) { // exists?
          docs[doc.$id] = Object.assign(docs[doc.$id], doc);
        } else {
          docs[doc.$id] = doc;
        }
      }
    });

    return Object["values"](docs);
  } 

  get(id: string) {
    return this.db.get(id).then(function (doc) {
      if (!doc.$id) { // first delta for doc?
        doc.$id = doc._id;
      }
      return doc;
    });
  } 

  save(item: Item) {
    return this.db.save(item).then((result) => {
      return result
    }); 
  }

  remove(item: Item) {
    return this.get(item._id).then(doc => {
      doc.$deleted = true 
      return this.save(doc);
    })
  }

  public loadAdditionalFields(type) {
    return this.query(type).then(docs => {
      this.additional_fields = docs.map((item)=> item.additional_fields ).filter((a) => a)
      this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b), []);
      this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b.name), []);
      this.additional_fields = this.additional_fields.filter((el, i, a) => i === a.indexOf(el))      
      return this.additional_fields
    });
  }

  put(item) {
    return this.db.put(item).then((res) => {
      return this.db.get(res.id).then((u) => {
        return u;
      });
    });
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(email) {
    console.log('user login', email);
    return this.query('user', '', { email: email }).then((res) => {
      console.log('user query', res );
      if (res && res.length > 0) {
        this.storage.set('currentUser', res[0]);
        this.currentUser = res[0]
        return res[0]
      }        
      throw {name: "not_found"};  
    })
  }

  saveProfile(item) {
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
    console.log('user signup', accountInfo);
    return this.login(accountInfo.email).catch((e) => {
      return this.storage.get('currentPosition').then((position) => {
        accountInfo.position = position
        return this.db.post(accountInfo).then((account) => {
          console.log('user post', account);
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
      console.log('user currentUser', response);
      this.currentUser = response
      return response
    })  
  }

  skipTour() {
    console.log('storage', this.storage);
    return this.storage.get('skipTour').then((response) => {
      console.log('storage res', response);
      return response
    })   
  }

  setSkipTour(skipTour) {
    this.storage.set('skipTour', skipTour).then((response) => {
      return response
    })   
  }
 

}
