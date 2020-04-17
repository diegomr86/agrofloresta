import { Component, Input } from '@angular/core';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'comments',
  templateUrl: 'comments.html'
})
export class CommentsComponent {
	@Input() item;
	@Input() item_type;

  message;
  comments;

  constructor(public database: Database, public utils: Utils, public api: Api) {
    this.message = ''
	}

  ngOnInit() {
    this.list()
  }

  list() {
    this.database.query('comments/' + this.item._id, { type: this.item_type }).then(comments => {
      this.comments = comments
    });
  }


	comment() {
    if (this.item && this.message) {
      let form = { message: this.message }
      form[this.item_type] = this.item._id

      this.database.post("comments", form).then(comment => {
        if (comment) {
          if (this.comments) {
            this.comments.push(comment)
          } else {
            this.comments = [comment]
          }
          this.utils.showToast('Comentário enviado. Obrigado por contribuir!', 'success');

          this.item.updatedAt = new Date();
          this.database.put(this.item_type+'s', this.item)
        }
        this.message = ''
      });
    }
  }

  delete(comment){
    if (comment.user._id == this.database.currentUser._id) {
      this.comments = this.comments.filter(c => c !== comment)
      this.database.remove('comments', comment).then(comment => {
        this.utils.showToast('O comentário foi excluído', 'success');
      });
    }
  }

}
