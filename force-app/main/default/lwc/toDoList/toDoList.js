import { LightningElement, api } from 'lwc';

export default class TodoItem extends LightningElement {
   @api title;
   @api detail;
   @api number;

   deleteItem(event) {
       this.dispatchEvent(new CustomEvent('delitem', {detail : this.number}));
   }
}