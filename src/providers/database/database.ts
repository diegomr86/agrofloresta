import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../../models/item';
import { Platform, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Utils } from '../../utils/utils';

@Injectable()
export class Database {

  // public baseUrl = 'http://localhost:3000/api/';
  public baseUrl = 'https://www.redeagroflorestal.com.br/api/';
  public db;
  public remote;
  public options;
  public cycles;
  public stratums;
  public additional_fields;
  public currentUser;
  public currentToken;
  public showTour;

  constructor(public storage: Storage, public plt: Platform, public http: HttpClient, public utils: Utils, public modalCtrl: ModalController) {

    console.log("DATABASE CONSTRUCTOR!!!")
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

  get(type: string, id = null) {
    var url = this.baseUrl + type
    if (id) {
      url += '/' + id
    }
    return this.http.get<any>(url, { headers: this.httpHeaders() }).toPromise().catch(e => this.showError(e, this.utils))
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
      this.currentUser = user
      return user
    })
  }

  login(credentials) {
    return this.http.post<any>(this.baseUrl + "users/login", credentials).toPromise().then((user) => {
      var token = user.token
      if (user && token) {
        this.storage.set('currentToken', token);
        this.currentToken = token
        this.currentUser = user
        return user
      }
    })
  }

  forgotPassword(data) {
    return this.http.post<any>(this.baseUrl + "users/forgot_password", data).toPromise()
  }
  validateCode(data) {
    return this.http.post<any>(this.baseUrl + "users/validate_code", data).toPromise()
  }
  updatePassword(data) {
    return this.http.post<any>(this.baseUrl + "users/update_password", data).toPromise()
  }

  async register(form) {
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

    return this.get('logout').then(() => {
      this.currentUser = undefined
      this.currentToken = undefined
      return this.storage.remove('currentToken')
    })

  }

  getCurrentUser() {
    return this.storage.get('currentToken').then((token) => {

      if (token) {
        this.currentToken = token
        return this.get('currentuser').then((user) => {
          this.currentUser = user
          return user
        })
      }
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
    if (this.currentToken) {
      return new HttpHeaders({
        'Authorization': 'Token ' + this.currentToken
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

  async showLogin() {
    var modal = await this.modalCtrl.create('LoginPage')
    modal.present()
  }
  async showTutorial() {
    var modal = await this.modalCtrl.create('TutorialPage')
    modal.present()
  }


}
