import { Component, Input } from '@angular/core';
import { User, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'post-user',
  templateUrl: 'post-user.html'
})
export class PostUserComponent {
  @Input() post;

  user;

  constructor(public navCtrl: NavController, public userDb: User, public api: Api) { }

  ngOnInit() { 
  	this.userDb.get(this.post.user_id).then((user) => {
  		this.user = user;
  	})
  	
  }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }


}
