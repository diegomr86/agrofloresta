import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Database } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;
  isReadyToSave: boolean;
  user;
  msg;
  codeConfirmed;

  constructor(public navCtrl: NavController,
    public database: Database,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public utils: Utils) {

    this.emailForm = formBuilder.group({
      email: ['', Validators.required],
    });
    this.codeForm = formBuilder.group({
      email: ['', Validators.required],
      passwordCode: ['', Validators.required],
    });
    this.passwordForm = formBuilder.group({
      email: ['', Validators.required],
      passwordCode: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    });

    this.passwordForm.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.passwordForm.valid;
    });

    this.isReadyToSave = this.passwordForm.valid;
  }

  forgotPassword() {
    this.database.forgotPassword(this.emailForm.value).then((user) => {
      if (user) {
        this.codeForm.controls.email.setValue(this.emailForm.controls.email.value);
        this.msg = "Um código de 4 dígitos foi enviado para: "+this.emailForm.controls.email.value+". Insira o código abaixo para continuar:"
      } else {
        this.utils.showToast("Usuário não encontrado", "error")
      }
    }).catch(e => {
      if (e.status == 422) {
        this.utils.showToast("Usuário não encontrado", "error")
      } else {
        this.utils.showToast(e.message, "error")
      }
    })
  }

  validateCode() {
    this.database.validateCode(this.codeForm.value).then((isValid) => {
      if (isValid) {
        this.passwordForm.controls.email.setValue(this.codeForm.controls.email.value);
        this.passwordForm.controls.passwordCode.setValue(this.codeForm.controls.passwordCode.value);
        this.codeConfirmed = true
      } else {
        this.utils.showToast("Código inválido", "error")
      }
    }).catch(e => {
      this.utils.showToast("Não foi possível validar o código. Tente novamente mais tarde", "error")
    })
  }
  updatePassword() {
    var password = this.passwordForm.controls.password.value
    var passwordConfirmation = this.passwordForm.controls.passwordConfirmation.value
    if (passwordConfirmation && passwordConfirmation == password) {

      this.database.updatePassword(this.passwordForm.value).then((isValid) => {
        if (isValid) {
          this.utils.showToast("Sua senha foi alterada com sucesso!", "success")
          this.database.login(this.passwordForm.value).then((user) => {
            if (user) {
              if (user.profileCompleted) {
                this.navCtrl.setRoot("HomePage");
              } else {
                this.navCtrl.setRoot('ProfileEditPage');
              }
            }
          })
        }
      }).catch(e => {
        this.utils.showToast("Não foi possível validar o código. Tente novamente mais tarde", "error")
      })

    } else {
      this.utils.showToast("As senhas digitadas são diferentes", "error")
    }
  }

  back() {
    this.navCtrl.push('LoginPage');
  }

}
