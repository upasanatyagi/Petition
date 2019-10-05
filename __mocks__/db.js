const spicedPg = require('spiced-pg');

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/practice`);
//first protocal second authorisation third port and fourth path
module.exports.getCityByName = (city, country) => {
    return db.query(
        `SELECT * FROM practice
        WHERE city =$1 AND country =$2`,
        [city, country]
    );
};

// db.query(
//     `SELECT * FROM practice`
// ).then(
//     result => console.log(result)
// );
// db.query(
//     `SELECT * FROM practice WHERE name = 'Berlin'`
// ).then(
//     ({rows})=> console.log(rows)
// );
db.query(
    `INSERT INTO practice(city,country)
    VALUES ('Glasgow','UnitedKingdom')
    RETURNING *`
).then(
    ({
        rows
    }) => console.log(rows)
).catch(
    err => console.log(err.message)
).then(
    result => console.log(result)
);