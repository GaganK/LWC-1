import { LightningElement, wire,track } from 'lwc'; 
import { deleteRecord } from 'lightning/uiRecordApi';
import fetchAccounts from '@salesforce/apex/accountProcess.fetchAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];
 
const columns = [   
    { label: 'Name', fieldName: 'Name',sortable: "true" }, 
    { label: 'Industry', fieldName: 'Industry',sortable: "true" },
    { label: 'Type', fieldName: 'Type',sortable: "true" }, 
    { label: 'Rating', fieldName: 'Rating',sortable: "true" }, 
    {
        label: 'Action',
        type: 'action',
        typeAttributes: { rowActions: actions },
    }, 
];

export default class LightningDataTableLWC extends NavigationMixin( LightningElement ) {
     
    @track accounts; 
    @track error; 
    @track columns = columns;
    @track sortBy;
    @track sortDirection;

    @wire(fetchAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.log(error);
            this.error = error;
        }
    }


    handleKeyChange( event ) { 
         
        const searchKey = event.target.value; 
 
        if ( searchKey ) { 
 
            fetchAccounts( { searchKey } )   
            .then(result => { 
 
                this.accounts = result; 
 
            }) 
            .catch(error => { 
 
                this.error = error; 
 
            }); 
 
        } else 
        this.accounts = undefined; 
 
    }

    handleRowAction( event ) {

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete':
                this.handleDeleteRecord(row.Id);
                break;
            default:
        }

    }

    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.accounts));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.accounts = parseData;

    }

    // deleteing account record 
    handleDeleteRecord(delId) {
        deleteRecord(delId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

}