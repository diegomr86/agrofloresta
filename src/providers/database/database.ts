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

    this.db = new PouchDB('agrofloresta');
    this.remoteDb = new PouchDB('http://www.diegomr86.ga:13155/agrofloresta')
  //   let dd = this.db
  //   dd.allDocs().then(function(_response){
  //     var toBeDeleted = _response.rows.length;
  //     _response.rows.forEach(function(row){
  //         dd.remove(row.id, row.value.rev, function(err, success){
  //             if(err){
  //                 console.error(err);
  //             }
  //             else if(success){
  //                 console.log("document with id %s was deleted", row.id);
  //             }
  //             if(--toBeDeleted == 0){
  //                 console.log("done");
  //             }
  //         });
  //     });
  // });

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

  public loadAdditionalFields(type) {
    return this.query(type).then(result => {
      this.additional_fields = result.docs.map((item)=> item.additional_fields ).filter((a) => a)
      this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b), []);
      this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b.name), []);
      this.additional_fields = this.additional_fields.filter((el, i, a) => i === a.indexOf(el))      
      return this.additional_fields
    });
  } 

}
