const spicedPg = require("spiced-pg");

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/practice`);
//first protocal second authorisation third port and fourth path

module.exports.getPetition = () => {
    return db.query(`SELECT first,last FROM signatures`);
};

module.exports.postPetition = function(signature, userId) {
    console.log("postPetition in db", signature, userId);
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1,  $2)
        RETURNING id`,
        [signature, userId]
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
module.exports.getNumSigners = () => {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};

module.exports.addProfile = function(age, city, url, user_id) {
    console.log(
        "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj       ",
        age,
        city,
        url,
        user_id
    );
    return db.query(
        `INSERT INTO  user_profiles(age,city,url,user_id) VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [age, city, url, user_id]
    );
};
module.exports.signers = function(city) {
    console.log("in database signers--");
    if (!city) {
        return db.query(
            `SELECT users.first,users.last,user_profiles.age,user_profiles.city,user_profiles.url FROM users LEFT JOIN user_profiles ON users.id=user_profiles.user_id  INNER JOIN signatures ON users.id=signatures.user_id`
        );
    } else {
        return db.query(
            `SELECT users.first,users.last,user_profiles.age,user_profiles.city,user_profiles.url FROM users LEFT JOIN user_profiles ON users.id=user_profiles.user_id  INNER JOIN signatures ON users.id=signatures.user_id WHERE user_profiles.city=$1`,
            [city]
        );
    }
};
module.exports.showProfile = function(user_id) {
    console.log("user_id:-----", user_id);
    return db.query(
        `SELECT first AS first,last AS last,email AS email,age AS age,city AS city,url AS url
    FROM users
    LEFT JOIN user_profiles
    ON users.id= user_profiles.user_id
    WHERE users.id = $1`,
        [user_id]
    );
};
