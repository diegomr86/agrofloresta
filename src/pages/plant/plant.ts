import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

import { Chart } from 'chart.js';

@IonicPage({
  segment: "plant/:id"
})
@Component({
  selector: 'page-plant',
  templateUrl: 'plant.html'
})
export class PlantPage {
  Object = Object;
  @ViewChild("stratumCanvas") stratumCanvas: ElementRef;
  private stratumChart: Chart;
  @ViewChild("cycleCanvas") cycleCanvas: ElementRef;
  private cycleChart: Chart;

  plant;

  constructor(public navCtrl: NavController, navParams: NavParams, public database: Database, public api: Api, public utils: Utils, private changeDetector : ChangeDetectorRef) {
    this.database.get('plants', navParams.get('id')).then(res => {
      this.plant = res
      this.changeDetector.detectChanges();
      var stratum_answers = this.answers('stratum')
      this.stratumChart = new Chart(this.stratumCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: Object.keys(stratum_answers).sort((k, y) => {
            return stratum_answers[y] - stratum_answers[k]
          }),
          datasets: [
            {
              label: "Quantidade de votos",
              data: Object.values(stratum_answers).sort().reverse(),
              backgroundColor: [
                "#276248",
                "#2e7555",
                "#368763",
                "#3d9970",
                "#44ab7d",
                "#50b98a",
              ],
              hoverBackgroundColor: [
                "#2e7555",
                "#368763",
                "#3d9970",
                "#44ab7d",
                "#50b98a",
                "#62c096"
              ]
            }
          ]
        }
      });

      var cycle_answers = this.answers('cycle')
      this.cycleChart = new Chart(this.cycleCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: Object.keys(cycle_answers).sort((k, y) => {
            return cycle_answers[y] - cycle_answers[k]
          }),
          datasets: [
            {
              label: "Quantidade de votos",
              data: Object.values(cycle_answers).sort().reverse(),
              backgroundColor: [
                "#276248",
                "#2e7555",
                "#368763",
                "#3d9970",
                "#44ab7d",
                "#50b98a",
              ],
              hoverBackgroundColor: [
                "#2e7555",
                "#368763",
                "#3d9970",
                "#44ab7d",
                "#50b98a",
                "#62c096"
              ]
            }
          ]
        }
      });

    });
  }

  edit() {
    this.navCtrl.push('PlantFormPage', { id: this.plant._id });
  }

  answers(field) {
    var answers = {}
    this.plant.quiz_answers.forEach(quiz_answer => {
      if (quiz_answer.field == field) {
        var answer = null
        if (field == 'stratum') {
          answer = this.database.stratums[quiz_answer.answer]
        } else {
          answer = this.database.cycles[quiz_answer.answer].split('(')[1].replace(')', '')
        }
        if (answers[answer] > 0) {
          answers[answer] += 1
        } else {
          answers[answer] = 1
        }
      }
    })
    return answers
  }

}
