import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import RelationalPouch from 'relational-pouch';
import { Item } from '../../models/item';
PouchDB.plugin(RelationalPouch);
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
    this.db.setSchema([
      { singular: 'user', plural: 'users', relations: { plants: { hasMany: 'plant'}}},
      { singular: 'plant', plural: 'plants', relations: { user: { belongsTo: 'user'}}}
    ])
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

  query(type: string, name?: string) {
    this.db.find({
      selector: {type: {$eq: type}, name: {$regex: RegExp(name, "i")}}
    }).then((result) => {
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
