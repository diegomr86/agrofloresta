import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Item } from '../../models/item';
import { Api } from '../api/api';

@Injectable()
export class Items {

  constructor(public http: HttpClient, public api: Api) { }

  list(params?: any) {
	return this.http.get<Item[]>(this.api.url + '/items', params)
  }

  query(params?: any) {
	return this.http.get<Item[]>(this.api.url + '/items', params)
  } 

  create(item: Item) {
    return this.api.post('/items', item) 
  }

  delete(item: Item) {
  }

}
