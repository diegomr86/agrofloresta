import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import PouchDB from 'pouchdb';

import { Item } from '../../models/item';
import { Api } from '../api/api';

@Injectable()
export class Items {
  
  public db;
  public currentItems: Item[];

  constructor() { 
    this.db = new PouchDB('item');
  }

  query(name?: string) {
    this.db.allDocs({
      include_docs: true,
      attachments: true,
      binary: true,
      startkey: name, 
      endkey: name+"\ufff0"
    }).then((doc) => {
      this.currentItems = doc.rows.map(r => r.doc);
      console.log(doc)
    });
  } 

  get(id: string) {
    return this.db.get(id).then(function (item) {
      return item;
    });
  } 

  create(item: Item) {
    console.log(item)
    return this.db.put(item).then((result) => {
      if (!item._rev){
        item._rev = result.rev
        this.currentItems.push(item);
      } else {
        console.log('aqui')
        this.currentItems = this.currentItems.map((i) => (i._id == item._id ? item : i));
        console.log(this.currentItems)
      }
    }); 
  }

  async remove(item: Item) {
    console.log(item)
    await this.db.remove(item)
    this.currentItems = this.currentItems.filter(obj => obj !== item)
  }

}
