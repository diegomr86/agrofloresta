import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { Item } from '../../models/item';
PouchDB.plugin(PouchFind);

@Injectable()
export class Database {
  
  public db; 
  public currentItem: Item;
  public itemsList: Item[];
  public cycles;
  public stratums;

  constructor() { 
    this.db = new PouchDB('agrofloresta');
    // this.db.destroy()

    this.db.createIndex({
      index: {
        fields: ['type','name']
      }
    }).then(function (result) {
      console.log("created index", result);
    }).catch(function (err) {
      console.log(err);
    });

  }

  query(type: string, name?: string, filters?) {
    console.log("query: ", type, name)
    let selector = { type: {$eq: type}, name: {$regex: RegExp(name, "i")}}
    console.log("filters", filters);
    console.log("selector1", selector);
    if (filters) {
      Object.keys(filters).forEach((key) => {
        console.log(key, filters[key]);
        if (filters[key]) {
          selector[key] = { $eq: filters[key] }
        }
      })
    }
    console.log("selector", selector)
    this.db.find({
      selector: selector
    }).then((result) => {
      console.log("lista: ", result.docs)
      this.itemsList = result.docs
    });
  } 

  get(id: string) {
    return this.db.get(id).then(function (item) {
      return item;
    });
  } 

  save(item: Item) {
    return this.db.put(item).then((result) => {
      if (!item._rev){
        item._rev = result.rev
        this.itemsList.push(item);
      } else {
        item._rev = result.rev
        this.itemsList = this.itemsList.map((i) => (i._id == item._id ? item : i));
      }
      this.currentItem = item;
    }); 
  }

  async remove(item: Item) {
    await this.db.remove(item)
    this.itemsList = this.itemsList.filter(obj => obj !== item)
  }

}
