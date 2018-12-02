import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Database, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-plants',
  templateUrl: 'plants.html'
})
export class PlantsPage {
  Object = Object;
  filters;
  plants;
  morePlants = [];
  searching;

  constructor(public navCtrl: NavController, public database: Database, public api: Api, public modalCtrl: ModalController, public http: HttpClient) {
       

    this.filters = {
      cycle: '',
      stratum: '',
    }

    this.searching = false

    this.list();
    // this.populate();

  }

  list(name = '') {
    
    this.database.query('plant', name, this.filters).then(res => {
      this.plants = res.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
      });

      if (this.plants && this.plants.length > 10) {
          this.morePlants = this.plants.slice(10, this.plants.length+1)
          this.plants = this.plants.slice(0, 10)
        }
    })  
  }

  showMore(infiniteScroll) {
    if (this.morePlants && this.morePlants.length > 0) {
      this.plants = this.plants.concat(this.morePlants.slice(0, 5))            
      this.morePlants = this.morePlants.slice(5, this.morePlants.length+1)
    }
    infiniteScroll.complete();

  }

  search(ev?) {
    this.searching = true

    let val = '';
    if (ev) {
      val = ev.target.value;
    }
    this.list(val);    
  }

  /**
   * Prompt the user to add a new item. This shows our PlantFormPage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  add() {
    this.navCtrl.push('PlantFormPage');
  } 

  /**
   * Navigate to the detail page for this item.
   */
  open(id) {
    this.navCtrl.push('PlantPage', {
      id: id
    });
  }
  
  // populate() {
  //   let estratos = {
  //     "Sol Pleno": "emergente",
  //     "Luz Difusa": "alto",
  //     "Meia Sombra": "medio",
  //     "Sombra": "baixo",
  //   }
  //   let ciclos = {
  //     "Anual": "placenta1",
  //     "Bienal": "secundaria1",
  //     "Perene": "climax"
  //   }
  //   let arr = [];

  //   let db = this.database
    
  //   this.http.get('http://localhost/crawler/plants.json').subscribe(
  //     res => {
  //       // this.oembed = res;
  //       if (res) {
  //         console.log('populate:', res);
  //         let keys = [];
    
  //         res.forEach(function (p) {
  //           keys = keys.concat(p['ciclo-de-vida'])
  //           let plant =   {
  //             "source": p.fonte,
  //             "type": "plant",
  //             "user_id": "81a953fe-f3b2-47ee-b951-7e1ef1a67479",
  //             "picture": p.picture,
  //             "pictures": p.pictures,
  //             "name": p.nome,
  //             "scientific_name": p['nome-cientfico'],
  //             "popular_name": p['nomes-populares'],
  //             "family": p['familia'],
  //             "category": p['categoria'].map(e => e == 'Plantas Daninhas' ? 'Plantas Indicadoras' : e),
  //             "climate": p['clima'],
  //             "origin": p['origem'],
  //             "height": p['altura'],
  //             "luminosity": p['luminosidade'],
  //             "ciclo": p['ciclo-de-vida'],
  //             "synonymy": p['sinonmia'],
  //             "warning": p['alerta'],
  //             "description": p.description,
  //             "stratum": estratos[p.luminosidade[p.luminosidade.length-1]],
  //             "cycle": ciclos[p['ciclo-de-vida'][p['ciclo-de-vida'].length-1]],
  //             "harvest_time": "",
  //             "spacing": "",
  //             "companion_plants": [],
  //             "additional_fields": [],
  //             "medicinal": { 
  //               "indications": p['indicaes'],
  //               "properties": p['propriedades'],
  //               "parts_used": p['partes-utilizadas']
  //             },
  //           }
  //           console.log('p:: ', plant);
  //         });

  //         console.log('keys', Array.from(new Set(keys)));
    
  //       }         
  //     }, 
  //     error =>{
  //       console.log('oembed error:', error);
  //     }
  //   );

  //   // let db = this.database
  //   // arr.forEach(function (p) {

  //   //   let plant =   {
  //   //     "type": "plant",
  //   //     "user_id": "81a953fe-f3b2-47ee-b951-7e1ef1a67479",
  //   //     "picture": {
  //   //       "url": p.slug+".png",
  //   //       "medium": "static/medium/"+p.slug+".png",
  //   //       "thumb": "static/thumbs/"+p.slug+".png"
  //   //     },
  //   //     "name": p.nome,
  //   //     "scientific_name": p.nome_cientifico,
  //   //     "popular_name": p.nome_popular,
  //   //     "description": p.descricao+'\n\n'+p.epoca_regiao+'\n\n'+p.aproveitamento,
  //   //     "stratum": "",
  //   //     "cycle": "",
  //   //     "harvest_time": p.colheita+" dias",
  //   //     "spacing": "",
  //   //     "companion_plants": p.companheiras.split(', '),
  //   //     "additional_fields": [],
  //   //   }
  //   //   console.log('p:: ', plant);
  
  //   //   db.save(plant);

  //   // });


  // }


}
