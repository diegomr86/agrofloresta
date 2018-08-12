import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Injectable()
export class Utils {

  constructor(public alertCtrl: AlertController, private toastCtrl: ToastController) { }

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

  public showToast(message: string, cssClass?: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: cssClass
    });
    toast.present();
  }


}