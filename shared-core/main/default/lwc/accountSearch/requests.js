const herokuEndpoint = "https://data-faker.herokuapp.com/collection";

const fetchAccounts = (amountOfRecords, recordMetadata) => fetch(herokuEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
        amountOfRecords,
        recordMetadata,
    }),
});

export default fetchAccounts;
