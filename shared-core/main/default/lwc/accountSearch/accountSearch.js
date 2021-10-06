import { LightningElement } from 'lwc';

import { columns, recordMetadata, getSortFunctions } from './dataDescription';
import fetchAccounts from './requests';


const SORT_ASC_DIRECTION = "asc";
const SORT_DESC_DIRECTION = "desc";


export default class AccountSearch extends LightningElement {
    _amountOfRecords = 100;

    _data = [];

    _columns = columns;

    _sortDirection;

    _defaultSortDirection;

    _sortedBy;

    _sortFunctionsByField;

    get data() {
        return this._data;
    }

    get columns() {
        return this._columns;
    }

    get sortDirection() {
        return this._sortDirection;
    }

    set sortDirection(value) {
        if (value != SORT_ASC_DIRECTION && value != SORT_DESC_DIRECTION) {
            throw new Error('Invalid sort direction');
        }
        this._sortDirection = value;
    }

    get sortBy() {
        return this._sortedBy;
    }

    get defaultSortDirection() {
        return this._defaultSortDirection;
    }

    set defaultSortDirection(value) {
        if (value != SORT_ASC_DIRECTION && value != SORT_DESC_DIRECTION) {
            throw new Error('Invalid sort direction');
        }
        this._defaultSortDirection = value;
    }

    connectedCallback() {
        this._sortFunctionsByField = getSortFunctions();
        return fetchAccounts(this._amountOfRecords, recordMetadata)
            .then(response => response.json())
            .then(result => this._data = result)
            .catch(() => this.dispatchEvent(new CustomEvent('erroroccured')));
    }

    onsort(event) {
        try {
            this._setSortOrdering(event);
            this._data = this._sortData(this._data, event.detail.fieldName, event.detail.sortDirection === SORT_ASC_DIRECTION ? -1 : 1);
        } catch (err) {
            this.dispatchEvent(new CustomEvent('erroroccured'));
        }
    }

    _sortData(data, sortBy, sortDirection) {
        return [...data.sort(this._sortFunctionsByField.get(sortBy)(sortBy, sortDirection))];
    }

    _setSortOrdering(event) {
        this._sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.defaultSortDirection = event.detail.sortDirection === SORT_ASC_DIRECTION ? SORT_DESC_DIRECTION : SORT_ASC_DIRECTION;
    }
}