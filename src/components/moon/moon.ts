import { Component } from '@angular/core';

/**
 * Generated class for the MoonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'moon',
  templateUrl: 'moon.html'
})
export class MoonComponent {
	moonPhase;

  constructor() {
	  this.moonPhase = this.getMoonPhase();
  }

  getMoonPhase() {

    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth(),
        date = d.getDate(),
        c,e,jd,b,diff;

    if (month < 3) {
        year--;
        month += 12;
    }

    month++;

    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + date - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);

    diff = jd*10;
    diff = +diff.toFixed(2);

    if (b >= 8 ) {
        b = 0;
    }

    switch (b) {
        case 0:
            return "nova";
        case 1:
            return "nova";
        case 2:
            return "crescente";
        case 3:
            return "crescente";
        case 4:
            return "cheia";
        case 5:
            return "cheia";
        case 6:
            return "minguante";
        case 7:
            return "minguante";
        default:
            console.log('Error');
    }
	}


}
