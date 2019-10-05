const db = require('./db');
db.getCityByName('Glasgow').then(
    ({
        rows
    }) => console.log(rows)
);


// INSERT INTO actors(name,age,oscars)
// VALUES('leo',45,1)
// RETURNING *;