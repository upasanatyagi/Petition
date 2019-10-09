let {
    genSalt,
    hash,
    compare
} = require("bcryptjs");
const {
    promisify
} = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);



// genSalt()
//     .then(salt => {
//         console.log(salt);
//         return hash("monkey", salt);
//     })
//     .then(hash => {
//         console.log(hash);
//         return compare("monkey1", hash);
//     })
//     .then(isMatch => console.log(isMatch));