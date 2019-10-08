const spicedPg = require('spiced-pg');

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/practice`);
//first protocal second authorisation third port and fourth path
module.exports.getPetition = () => {
    return db.query(
        `SELECT first,last FROM signatures`);
};

module.exports.postPetition = function(first, last, signature) {
    return db.query(
        `INSERT INTO signatures (first,last, signature) VALUES ($1,  $2, $3)
        RETURNING id`,
        [first, last, signature]

    );

};
module.exports.signId = function(usersignId) {
    return db.query(
        `SELECT signature, first FROM signatures WHERE id = $1`,
        [usersignId]
    );
};