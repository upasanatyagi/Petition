const spicedPg = require("spiced-pg");

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/practice`);
//first protocal second authorisation third port and fourth path
module.exports.getPetition = () => {
    return db.query(`SELECT first,last FROM signatures`);
};

module.exports.postPetition = function(first, last, signature, userId) {
    return db.query(
        `INSERT INTO signatures (first,last, signature, user_id) VALUES ($1,  $2, $3, $4)
        RETURNING id`,
        [first, last, signature, userId]
    );
};
module.exports.signId = function(usersignId) {
    return db.query(`SELECT signature FROM signatures WHERE user_id = $1`, [
        usersignId
    ]);
};

// insert into signatures (first,last,signature) WHERE user_id=24 VALUES('aa','bb','cc');

module.exports.postRegistration = function(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first,last, email, password) VALUES ($1,  $2, $3 ,$4)
        RETURNING id`,
        [first, last, email, password]
    );
};
module.exports.login = function(email) {
    return db.query(
        `SELECT id,password AS hash FROM users WHERE email=$1
        `,
        [email]
    );
};
module.exports.getSign = function(userId) {
    return db.query(`SELECT signature FROM signatures WHERE user_id=$1`, [
        userId
    ]);
};
