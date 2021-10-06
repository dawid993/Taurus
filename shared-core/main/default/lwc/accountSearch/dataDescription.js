import { currencySortFn, dateSortFn, stringSortFn } from './sortFunctions';

const recordMetadata = {
    name: 'name',
    email: 'email',
    website: 'url',
    amount: 'currency',
    phone: 'phoneNumber',
    closeAt: 'dateInFuture',
};

const columns = [
    { label: 'Label', fieldName: 'name', sortable: true },
    { label: 'Website', fieldName: 'website', type: 'url', sortable: true },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency', sortable: true },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date', sortable: true },
];


const getSortFunctions = () => {
    const sortAcc = new Map();
        sortAcc.set('website', stringSortFn);
        sortAcc.set('amount', currencySortFn);
        sortAcc.set('name', stringSortFn);
        sortAcc.set('closeAt', dateSortFn);
        return sortAcc;
}

export {
    recordMetadata,
    columns,
    getSortFunctions
}