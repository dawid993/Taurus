import { api, LightningElement } from 'lwc';

export default class ErrorScreen extends LightningElement {
    @api
    errorTitle = '';

    @api
    errorMessage = '';   

    emitCloseEvent() {
        this.dispatchEvent(new CustomEvent('closeerrorscreen', {
            bubbles : true
        }));
    }

}