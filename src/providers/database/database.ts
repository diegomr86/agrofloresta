import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import DeltaPouch from 'delta-pouch';
import { Item } from '../../models/item';
PouchDB.plugin(DeltaPouch);
PouchDB.plugin(PouchFind);

@Injectable()
export class Database {
  
  public db; 
  public remoteDb; 
  public cycles;
  public stratums;
  public additional_fields;

  constructor() { 
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


    console.log('Creating database local');
    this.db = new PouchDB('agrofloresta-prod');
    console.log('Creating database remote');
    this.remoteDb = new PouchDB('https://agrofloresta.diegomr86.ga:6984/agrofloresta-prod')
    // this.remoteDb = new PouchDB('https://agrofloresta.diegomr86.ga:6984/agrofloresta', {
    //   ajax: {
    //     headers: {
    //       Authorization: 'Basic ' + btoa('agrofloresta:ernstgotsch')
    //     }
    //   }
    // })
    // let dd = this.db 
    // dd.allDocs({include_docs: true}).then(function(_response){
    //   var toBeDeleted = _response.rows.length;
    //   _response.rows.forEach(function(row){
    //     if (row.doc.type == 'plant') {
    //     console.log('row: ', row);
    //     dd.remove(row.id, row.value.rev, function(err, success){
    //         if(err){
    //             console.error(err);
    //         }
    //         else if(success){
    //             console.log("document with id %s was deleted", row.id);
    //         }
    //         if(--toBeDeleted == 0){
    //             console.log("done");
    //         }
    //     });
          
    //     }
    //   });
    // });

    console.log('Sync database...');
    this.db.sync(this.remoteDb, { live: true }).on('complete', function (change) {
      console.log('DB sync change', change);
    }).on('error', function (err) {
      console.log('DB sync error', err);
      console.log(err);
    }).on('denied', function(err){
      console.log(err);
    });

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

  all() {
    return this.db.all();
  } 

  query(type: string, name?: string, filters?) {
    let selector = { type: {$eq: type} }
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
    }).then(res => {
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

    });
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
    console.log('save: ', item);
    return this.db.save(item).then((result) => {
      // item._rev = result.rev
      console.log('saved: ', result);
      return result
    }); 
  }

  remove(item: Item) {

    console.log('remove:',item);
    return this.get(item._id).then(doc => {
      console.log('removedoc:', doc);
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
 

}
