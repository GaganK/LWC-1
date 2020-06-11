import { LightningElement,track} from 'lwc';
import getAccountList from '@salesforce/apex/accountProcess.getAccountList';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
 

import { createRecord } from 'lightning/uiRecordApi';
 import ACCOUNT_OBJECT from '@salesforce/schema/Account';
    



export default class accountSearch extends LightningElement {
    
    @track accountName;
    @track accountId; 
    @track accounts;
    sVal = '';
 
    @track bShowModal = false;
 

	handleNameChange(event){
        this.accountName = event.target.value;
    }
 
   // save called on click of save to insert account and contact record with LDS
    save() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.accountName;
        const accRecordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields};
       // create account record 
        createRecord(accRecordInput)
            .then(account => {
                this.accountId = account.id;
               // display success toast msg for account
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created',
                        variant: 'success',
                    }),
                );
 
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }



    /* javaScipt functions start */ 
    openModal() {    
        // to open modal window set 'bShowModal' tarck value as true
        this.bShowModal = true;
    }
 
    closeModal() {    
        // to close modal window set 'bShowModal' tarck value as false
        this.bShowModal = false;
    }
    /* javaScipt functions end */ 

    

    updateSeachKey(event) {
        this.sVal = event.target.value;
    }
 
    // call apex method on button click 
    handleSearch() {
        // if search input value is not blank then call apex method, else display error msg 
        if (this.sVal !== '') {
            getAccountList({
                    searchKey: this.sVal
                })
                .then(result => {
                    // set @track accounts variable with return account list from server  
                    this.accounts = result;
                })
                .catch(error => {
                    // display server exception in toast msg 
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    // reset accounts var with null   
                    this.accounts = null;
                });
        } else {
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);
        }  
    }
}