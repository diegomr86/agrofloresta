import { Injectable } from '@angular/core';
import { Database } from '../database/database';

@Injectable()
export class Items extends Database {
  public cycles;
  public stratums;
  public additional_fields;

  constructor() { 
    super();
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

  }

  loadAdditionalFields() {
    this.additional_fields = this.itemsList.map((item)=> item.additional_fields ).filter((a) => a)
    this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b), []);
    this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b.name), []);
    this.additional_fields = this.additional_fields.filter((el, i, a) => i === a.indexOf(el))
  } 

}
