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
  loading = false;

  constructor(public database: Database, public utils: Utils, public api: Api) {
    this.message = ''
	}

  ngOnInit() {
    this.list()
  }

  list() {
    this.loading = true
    this.database.query('comments/' + this.item._id, { type: this.item_type }).then(comments => {
      this.comments = comments
      this.loading = false
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
          this.item.comments = this.comments
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
      this.database.remove('comments', comment).then(comment => {
        this.comments = this.comments.filter(c => c._id !== comment._id)
        this.item.comments = this.comments
        this.utils.showToast('O comentário foi excluído', 'success');
      });
    }
  }

}
