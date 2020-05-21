import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { Database } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage()googlePlus
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user;
  view = 'login';
  loginForm: FormGroup;
  loginReady: boolean;
  registerForm: FormGroup;
  registerReady: boolean;
  passwordReady: boolean;
  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;
  msg;
  codeConfirmed;

  constructor(public navCtrl: NavController,
    public database: Database,
    private fb: Facebook,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public utils: Utils) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

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

    this.loginForm.valueChanges.subscribe((v) => {
      this.loginReady = this.loginForm.valid;
    });

    this.registerForm.valueChanges.subscribe((v) => {
      this.registerReady = this.registerForm.valid;
    });

    this.passwordForm.valueChanges.subscribe((v) => {
      this.passwordReady = this.passwordForm.valid;
    });

    this.loginReady = this.loginForm.valid;
    this.registerReady = this.registerForm.valid;

  }

  login() {
    this.database.login(this.loginForm.value).then((user) => {
      if (user) {
        if (user.profileCompleted) {
          this.utils.showToast("Seja bem vindo!")
          this.closeModal()
        } else {
          this.utils.showToast("Seja bem vindo!")
          this.closeModal()
        }
      }
    }).catch(e => {
      if (e.status == 422) {
        this.utils.showToast("Usuário ou senha inválidos", "error")
      } else {
        this.utils.showToast(e.message, "error")
      }
    });
  }

  facebookLogin() {

    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.fb.api("me?fields=id,name,email,first_name,picture.width(320).height(320).as(picture_large)", []).then((user) => {
            let metadata = { email: user.email, name: user.name, picture: user.picture_large.data.url, facebook_id: user.id }
            this.database.login({ email: user.email, password: 'fbid_'+user.id }).then((resp) => {
              this.utils.showToast("Seja bem vindo!")
              this.closeModal()
            }).catch((e) => {
              metadata['password'] = Math.random().toString(36).slice(-6)
              this.database.register(metadata).then((resp) => {
                if (resp) {
                  this.utils.showToast("Seja bem vindo!")
                  this.closeModal()
                }
              });
            })
         })
      }).catch(e => console.log('Error logging into Facebook', e));
  }

  // googleLogin() {
  //
  //   this.googlePlus.login()
  //   .then(user => {
  //     this.database.register({ type: 'user', email: user.email, name: user.displayName, picture: user.imageUrl, google_id: user.userId }).then((resp) => {
  //       this.navCtrl.setRoot(MainPage);
  //     }).catch((e) => {
  //       if (e.name == 'conflict') {
  //         this.database.login(user.email).then((resp) => {
  //           if (resp) {
  //             this.navCtrl.setRoot(MainPage);
  //           }
  //         });
  //       }
  //     })
  //
  //   }).catch(err => console.error(err));
  //
  // }

  register() {
    this.database.register(this.registerForm.value).then((user) => {
      if (user && user._id) {
        this.utils.showToast("Seja bem vindo!")
        this.closeModal()
      }
    }).catch(e => {
      if (e.status == 422) {
        var errors = e.error.errors
        if (errors.email) {
          this.utils.showToast("Erro no email: " + errors.email.message, "error")
        } else if (errors.password) {
          this.utils.showToast("Erro na senha: " + errors.password.message, "error")
        } else {
          this.utils.showToast(e.error.message, "error")
        }
      } else {
        this.utils.showToast(e.message, "error")
      }
    })
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
                this.closeModal()
              } else {
                this.closeModal()
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

  async closeModal() {
    await this.navCtrl.pop();
  }

}
