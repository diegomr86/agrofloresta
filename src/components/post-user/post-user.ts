import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'post-user',
  templateUrl: 'post-user.html'
})
export class PostUserComponent {
  @Input() post;

  user;

  constructor(public navCtrl: NavController, public database: Database, public api: Api) { }

  ngOnInit() { 
  	this.database.get(this.post.user_id).then((user) => {
  		this.user = user;
  	})
  	
  }

  profile(user) {
    this.navCtrl.setRoot('ProfilePage', { id: user._id });
  }


}
