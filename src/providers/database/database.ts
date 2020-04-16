import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
import PouchFind from 'pouchdb-find';
import DeltaPouch from 'delta-pouch';
import WebSqlPouchCore from 'pouchdb-adapter-cordova-sqlite';
import { HTTP } from '@ionic-native/http/ngx';
import { Item } from '../../models/item';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

PouchDB.plugin(PouchDBAuthentication);
PouchDB.plugin(DeltaPouch);
PouchDB.plugin(PouchFind);
PouchDB.plugin(WebSqlPouchCore);

@Injectable()
export class Database {

  public baseUrl = 'http://localhost:3000/';
  public db;
  public userDb;
  public remote;
  public options;
  public cycles;
  public stratums;
  public additional_fields;
  public currentUser;
  public showTour;
  public syncSuccess;

  constructor(public storage: Storage, public plt: Platform, public http: HttpClient) {

    this.syncSuccess = false

    this.cycles = {
      placenta1: 'Placenta 1 (Até 3 meses)',
      placenta2: 'Placenta 2 (3 meses a 1 ano)',
      secundaria1: 'Secundária 1 (1 a 10 anos)',
      secundaria2: 'Secundária 2 (10 a 25 anos)',
      secundaria3: 'Secundária 3 (25 a 50 anos)',
      climax: 'Climax (Mais de 50 anos)'
    }

    this.stratums = {
      baixo: 'Baixo',
      medio: 'Médio',
      alto: 'Alto',
      emergente: 'Emergente'
    };

  }

  query(type: string, name?: string, filters?) {

    return this.http.get(this.baseUrl+'/'+type+'s')

    //
    // let selector = { type: { $eq: type } }
    // if (name) {
    //   selector[(type == 'post' ? 'title' : 'name')] = { $regex: RegExp(name, "i") }
    // }
    // if (filters) {
    //   Object.keys(filters).forEach((key) => {
    //     if (filters[key]) {
    //       selector[key] = { $eq: filters[key] }
    //     }
    //   })
    // }
    //
    // let that = this
    // let dynamicDb = type == 'user' ? this.userDb : this.db
    // return dynamicDb.createIndex({
    //   index: {
    //     fields: Object.keys(selector)
    //   }
    // }).then(function(result) {
    //   return dynamicDb.find({
    //     selector: selector
    //   }).then(res => {
    //
    //     return that.formatDocs(res);
    //
    //   });
    // }).catch(function(err) {
    //   console.log('query: index error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    // });
    //

  }

  formatDocs(res) {
    var docs = {},
      deletions = {};
    res.docs.forEach(function(doc) {

      if (!doc.$id) { // first delta for doc?
        doc.$id = doc._id;
      }
      if (doc.$deleted) { // deleted?
        delete (docs[doc.$id]);
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
    return this.db.get(id).then(function(doc) {
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
      this.additional_fields = docs.map((item) => item.additional_fields).filter((a) => a)
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

  saveProfile(item) {
    return this.userDb.put(item).then((res) => {
      return this.login(item._id)
    });
  }

  signup(email, metadata = {}) {
    return this.storage.get('currentPosition').then((position) => {
      return this.userDb.signUp(email, 'agrofloresteiro', {
        metadata: Object.assign({ position: position }, metadata)
      }).then(resp => {
        if (resp) {
          return this.login(email)
        }
      })
    });
  }

  login(email) {
    return this.getUser(email).then(res => {
      if (res && res._id) {
        this.storage.set('currentUser', res);
        this.currentUser = res
        return res
      }
    });
  }

  getUser(email) {
    if (!email.startsWith('org.couchdb.user:')) {
      email = 'org.couchdb.user:' + email
    }
    return this.userDb.get(email).then(res => {
      return res
    })
  }

  logout() {
    this.currentUser = undefined
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

  // copyUserIds() {
  //   this.db.find({
  //       "selector": {
  //         "_id": {
  //            "$gt": "0"
  //         }
  //       }
  //     }).then(docs => {
  //       console.log(docs)
  //       docs.docs.forEach(doc => {
  //         if (doc.user_id && !doc.user_id.startsWith('org.couchdb.user:') ) {

  //           console.log(doc.user_id)
  //           // let email = docs.docs.find(d => (d._id == doc.user_id)).email
  //           // doc.user_id = 'org.couchdb.user:'+email
  //           // this.db.put(doc).then((res) => {
  //           //   console.log(res)
  //           // })
  //           // doc.user_id = d
  //         }
  //       })
  //       console.log(docs);
  //     })

  // }

  // copyUsers() {

  //   console.log('remote', this.remote)
  //   console.log('opt', Object.assign(this.options, {skip_setup: true}))
  //   let remotedb = new PouchDB(this.remote, this.options)
  //   console.log('copy users!!!!!!!')

  //   this.query('user').then(docs => {
  //     console.log(docs.length)
  //     return this.userDb.find({
  //       "selector": {
  //         "_id": {
  //            "$gt": "0"
  //         }
  //       }
  //     }).then(users => {
  //       console.log('users:')
  //       console.log(users)


  //       docs.forEach((doc, index) => {
  //         let metadata = {
  //             username : doc.name,
  //             picture : doc.picture,
  //             location : doc.location,
  //             bio : doc.bio,
  //             position : doc.position,
  //             facebook_id : doc.facebook_id,
  //           }

  //         // console.log(index)
  //         // console.log(doc)

  //         if (!users.docs.find(u => (u._id == 'org.couchdb.user:'+doc.email))) {
  //           console.log('nao tem: '+doc.email)
  //           setTimeout(function(){
  //             remotedb.signUp(doc.email, 'agrofloresteiro', {
  //               metadata : metadata
  //             }, function (err, response) {
  //               console.log('email:', doc.email)
  //               console.log('meta:', metadata)
  //               console.log('err', err)
  //               console.log('response', response)
  //             });
  //           }, 1000);
  //         } else {
  //           var d = docs.filter(u => (u.email == doc.email))
  //           if (d.length > 1) {
  //             console.log('ja tem'+d.length+': '+doc.email)
  //             console.log(d)
  //             console.log(users.docs.find(u => (u._id == 'org.couchdb.user:'+doc.email)));
  //           }
  //         }


  //       })
  //     });
  //   });
  // }
}
