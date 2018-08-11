import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import PouchDB from 'pouchdb';
import slugify from 'slugify';

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
    console.log("XXXXXXXX buscando lista... XXXXXXXX");
	  this.db.allDocs({
      include_docs: true,
      attachments: true,
      binary: true,
      startkey: name, 
      endkey: name+"\ufff0"
    }).then((doc) => {
      console.log(doc)
      this.currentItems = doc.rows.map(r => r.doc);
      console.log(doc)
    }).catch((e) => {
      console.log(e);
    });
  } 

  create(item: Item) {
    item._id = slugify(item.name)
    console.log(item)
    this.db.put(item).then((result) => {
      item._rev = result.rev
      this.currentItems.push(item);
    }).catch((e) => {
      console.log(e);
    }); 
  }

  async remove(item: Item) {
    console.log(item)
    await this.db.remove(item)
    this.currentItems = this.currentItems.filter(obj => obj !== item)
  }

}
