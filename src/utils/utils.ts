import { AlertController } from 'ionic-angular';
import {Injectable } from '@angular/core';

@Injectable()
export class Utils {

  constructor(public alertCtrl: AlertController) { }

  public showConfirm(onContinue) {
    const confirm = this.alertCtrl.create({
      title: 'Tem certeza disso?',
      message: 'Essa é uma plataforma colaborativa e essa mudança vai valer para todos os usuários.',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Continuar',
          handler: onContinue
        }
      ]
    });
    confirm.present();
  }
}