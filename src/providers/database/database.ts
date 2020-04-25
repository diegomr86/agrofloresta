import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../../models/item';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Utils } from '../../utils/utils';

@Injectable()
export class Database {

  // public baseUrl = 'http://localhost:3000/api/';
  public baseUrl = 'https://www.redeagroflorestal.com.br/api/';
  public db;
  public userDb;
  public remote;
  public options;
  public cycles;
  public stratums;
  public additional_fields;
  public currentUser;
  public showTour;

  constructor(public storage: Storage, public plt: Platform, public http: HttpClient, public utils: Utils) {

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
    return this.http.get<any[]>(this.baseUrl + type, { params: params, headers: this.httpHeaders() }).toPromise().catch(e => this.showError(e, this.utils))
  }

  get(type: string, id: string) {
    return this.http.get<any>(this.baseUrl + type + '/' + id, { headers: this.httpHeaders() }).toPromise().catch(e => this.showError(e, this.utils))
  }

  save(type: string, item: Item) {
    if (item._id) {
      return this.put(type, item)
    } else {
      delete item._id
      return this.post(type, item)
    }
  }

  post(type: string, item: Item) {
    return this.http.post<any>(this.baseUrl + type, item, { headers: this.httpHeaders() }).toPromise().catch(e => this.showError(e, this.utils))
  }

  put(type: string, item: Item) {
    return this.http.put<any>(this.baseUrl + type + '/' + item._id, item, { headers: this.httpHeaders() }).toPromise().catch(e => this.showError(e, this.utils))
  }

  remove(type: string, item: Item) {
    return this.http.delete<any>(this.baseUrl + type + '/' + item._id, { headers: this.httpHeaders() }).toPromise().catch(e => this.showError(e, this.utils))
  }

  saveProfile(item) {
    return this.http.put<any>(this.baseUrl + 'users/'+ item._id, item, { headers: this.httpHeaders() }).toPromise().then((user) => {
      this.currentUser.name = user.name
      this.currentUser.email = user.email
      this.currentUser.bio = user.bio
      this.currentUser.phone = user.phone
      this.currentUser.address = user.address
      this.currentUser.picture = user.picture
      this.currentUser.profileCompleted = user.profileCompleted

      this.storage.set('currentUser', this.currentUser);
      return this.currentUser
    })
  }

  login(credentials) {
    return this.http.post<any>(this.baseUrl + "users/login", credentials).toPromise().then((res) => {
      if (res && res._id) {
        this.storage.set('currentUser', res);
        this.currentUser = res
        return res
      }
    })
  }

  forgotPassword(email) {
    return this.http.post<any>(this.baseUrl + "users/forgot_password", { email: email }).toPromise().then((res) => {
      if (res && res._id) {
        this.storage.set('currentUser', res);
        this.currentUser = res
        return res
      }
    })
  }

  async signup(form) {
    var position = await this.storage.get('currentPosition')
    var coordinates = []
    if (position && position.latitude && position.longitude) {
      coordinates = [Number(position.latitude), Number(position.longitude)]
    }
    form['address'] = {
      location: {
        type: "Point",
        coordinates: coordinates
      }
    }
    return this.http.post<any>(this.baseUrl + 'users/register', form).toPromise().then(user => {
      if (user && user._id) {
        return this.login({ email: form.email, password: form.password })
      }
    })
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
      if (docs) {
        this.additional_fields = docs.map((item) => item.additional_fields).filter((a) => a)
        this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b), []);
        this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b.name), []);
        this.additional_fields = this.additional_fields.filter((el, i, a) => i === a.indexOf(el))
        return this.additional_fields
      }
    });
  }

  showError(e, utils) {
    utils.showToast((e.error || e.message), 'error');
  }


}
