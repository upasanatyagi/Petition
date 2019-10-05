const spicedPg = require('spiced-pg');

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/practice`);
//first protocal second authorisation third port and fourth path
module.exports.getPetition = () => {
    return db.query(
        `SELECT first,last FROM signatures`);
};

module.exports.postPetition = (first, last, signature) => {
    db.query(
        `INSERT INTO signatures (first,last, signature) VALUES ($1,  $2, $3)`,
        [first, last, signature]
    ).catch(
        err => console.log(err.message)
        // ).then(
        //     return "error"
    );
    // RETURNING "success"
};