import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../../models/item';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class Database {

  public baseUrl = 'http://localhost:3000/api/';
  public db;
  public userDb;
  public remote;
  public options;
  public cycles;
  public stratums;
  public additional_fields;
  public currentUser;
  public showTour;

  constructor(public storage: Storage, public plt: Platform, public http: HttpClient) {

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

  query(type, params = {}) {
    return this.http.get(this.baseUrl + type, { params: params, headers: this.httpHeaders() }).toPromise()
  }

  get(type: string, id: string) {
    return this.http.get(this.baseUrl + type + '/' + id, { headers: this.httpHeaders() }).toPromise()
  }

  save(type: string, item: Item) {
    return this.http.post(this.baseUrl + type, item, { headers: this.httpHeaders() }).toPromise()
  }

  put(type: string, item: Item) {
    return this.http.put(this.baseUrl + type + '/' + item._id, item, { headers: this.httpHeaders() }).toPromise()
  }

  remove(type: string, item: Item) {
    return this.http.delete(this.baseUrl + type + '/' + item._id, item, { headers: this.httpHeaders() }).toPromise()
  }

  saveProfile(type, item) {
    this.put(item).then((res) => {
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

  async login(email) {
    var res = await this.http.post(this.baseUrl + "users/login", { email: email, password: 'agrofloresta' }).toPromise()
    if (res && res._id) {
      this.storage.set('currentUser', res);
      this.currentUser = res
      return res
    }
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

  httpHeaders() {
    var currentUser = this.currentUser
    if (currentUser && currentUser.token) {
      return new HttpHeaders({
        'Authorization': 'Token ' + this.currentUser.token
      })
    } else {
      return new HttpHeaders({})
    }
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


}
