import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { Item } from '../../models/item';
PouchDB.plugin(PouchFind);

@Injectable()
export class Database {
  
  public db; 
  public remoteDb; 
  public cycles;
  public stratums;

  constructor() { 
    this.db = new PouchDB('agrofloresta');
    this.remoteDb = new PouchDB('http://www.diegomr86.ga:13155/agrofloresta')
    // this.db.destroy()

    // this.db.sync(this.remoteDb, { live: true }).on('complete', function (change) {
    //   console.log('DB sync change', change);
    // }).on('error', function (err) {
    //   console.log('DB sync error', err);
    //   console.log(err);
    // }).on('denied', function(err){
    //   console.log(err);
    // });

    this.db.createIndex({
      index: {
        fields: ['type','name']
      }
    }).then(function (result) {
      // console.log("created index", result);
    }).catch(function (err) {
      console.log(err);
    });

  }

  query(type: string, name?: string, filters?) {
    let selector = { type: {$eq: type}}
    if (name) {
      selector['name'] = {$regex: RegExp(name, "i")}
    }
    if (filters) {
      Object.keys(filters).forEach((key) => {
        console.log(key, filters[key]);
        if (filters[key]) {
          selector[key] = { $eq: filters[key] }
        }
      })
    }
    return this.db.find({
      selector: selector
    });
  } 

  get(id: string) {
    return this.db.get(id).then(function (item) {
      return item;
    });
  } 

  save(item: Item) {
    return this.db.put(item).then((result) => {
      item._rev = result.rev
      return item
    }); 
  }

  remove(item: Item) {
    return this.db.remove(item._id, item._rev)
  }

}
