import { LightningElement } from 'lwc';

export default class PortalRegistrationContainer extends LightningElement {
    _showErrorPanel = false;

    get showErrorPanel() {
        return this._showErrorPanel;
    }

    set showErrorPanel(value) {
        this._showErrorPanel = value;
    }

    closeErrorScreen() {
        this.showErrorPanel = false;
    }

    showErrorScreen() {
        this.showErrorPanel = true;
    }
}