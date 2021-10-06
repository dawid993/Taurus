const stringSortFn = (field,sortDirection) => (a,b) => sortDirection * a[field].localeCompare(b[field]);
const currencySortFn = (field,sortDirection) => (a,b) => sortDirection * (+a[field]) - (+b[field]);
const dateSortFn = (field,sortDirection) => (a,b) => sortDirection * (Date.parse(a[field]) - Date.parse((b[field])));

export {
    stringSortFn,
    currencySortFn,
    dateSortFn
}