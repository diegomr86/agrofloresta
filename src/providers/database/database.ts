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
  public remote; 
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


    console.log('Creating database');
    this.db = new PouchDB('agrofloresta-local');
    // this.remoteDb = new PouchDB('https://agrofloresta.diegomr86.ga:6984/agrofloresta-prod')
    this.remote = 'https://23bf9857-dbb4-4bc1-bc27-9413f91dfe3b-bluemix.cloudant.com/agrofloresta';
 
    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: "23bf9857-dbb4-4bc1-bc27-9413f91dfe3b-bluemix",
        password: "0ae78ba4ae29a03231d943f56d5408346f46ffd7dfde57f73accdc64a4d76578"
      }
    };
 
    this.db.sync(this.remote, options).on('change', function (info) {
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
 

}
