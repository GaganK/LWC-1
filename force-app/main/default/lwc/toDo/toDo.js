import { LightningElement, track } from 'lwc';

export default class ToDoList extends LightningElement {
   @track titleInput = 'test123';
   @track detailInput = 'test321';

   @track _list = [
       {title : 'test123', detail : 'test description'},
       {title : 'test321', detail : 'test 432 description'}
   ];

   get list() {
       return this._list.map((el, i) => {
           el.number = i;
           return el;
       });
   }

   onItemSubmit() {
       this._list.push({title : this.titleInput, detail : this.detailInput});

       this.titleInput = '';
       this.detailInput = '';
   }

   onTitleInputChange(event) {
       this.titleInput = event.target.value;
   }

   onDetailInputChange(event) {
       this.detailInput = event.target.value;
   }

   onDelitem(event) {
       this._list = this._list.filter((el, i) => {return i !== event.detail;});
   }
}