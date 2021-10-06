import { stringSortFn, currencySortFn, dateSortFn } from "../sortFunctions";
const ASC_DIRECTION = 1;
const DESC_DIRECTION = -1;

const sortCheck = (fn, fieldName, direction, arr) => arr.reduce((acc, currentValue) => ({
    ordered: !acc.previous ? true : acc.ordered && (direction * fn(currentValue[fieldName], acc.previous)) >= 0,
    previous: currentValue[fieldName]
}), {});


const stringSortCheck = (a, b) => a.localeCompare(b);
const currencySortCheck = (a, b) => (+a) - (+ b);
const dateSortCheck = (a, b) => Date.parse(a) - Date.parse(b);

const testData = [
    { 'stringField': 'A', currencyField: "123.11", dateField: "2021-01-12" },
    { 'stringField': 'B', currencyField: "114.21", dateField: "2021-01-15" },
    { 'stringField': 'B', currencyField: "1123.11", dateField: "2011-01-12" },
    { 'stringField': 'D', currencyField: "12.01", dateField: "1992-11-12" },
    { 'stringField': 'E', currencyField: "1213.14", dateField: "2022-01-12" },
    { 'stringField': 'F', currencyField: "123.21", dateField: "2001-09-12" },
    { 'stringField': 'G', currencyField: "123.41", dateField: "2021-03-11" },
    { 'stringField': 'H', currencyField: "13123.99", dateField: "2021-01-12" },
    { 'stringField': 'H', currencyField: "523.11", dateField: "2009-06-17" },
    { 'stringField': 'J', currencyField: "12231.12", dateField: "2012-01-14" },
    { 'stringField': 'A', currencyField: "11133.11", dateField: "2022-01-11" },
    { 'stringField': 'F', currencyField: "131.41", dateField: "2020-01-12" }
];
it('Should sort data in lexicographic order', () => {
    testData.sort(() => Math.random() - 0.5);   
    expect(sortCheck(stringSortCheck, 'stringField', ASC_DIRECTION, testData).ordered).toBe(false);
    testData.sort(stringSortFn('stringField', ASC_DIRECTION));
    expect(sortCheck(stringSortCheck, 'stringField', ASC_DIRECTION, testData).ordered).toBe(true);
});