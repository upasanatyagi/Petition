const express = require("express");
const app = express();
exports.app = app;
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const db = require("./database");
const csurf = require("csurf");
const bcrypt = require("./bcrypt");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14 //expiration age,how long cookie to last
    })
);

app.use(csurf());

app.use((req, res, next) => {
    res.set("x-frame-otions", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

// res.cookie('name', 'value', {
//     sameSite: true
// });

app.get("/", (req, res) => {
    // console.log('req.sessionin /route');
    res.redirect("/registration");
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        csrfToken: req.csrfToken()
    });
});

//checking cookies,if not present
app.post("/petition", (request, response) => {
    console.log("............in post petition");
    let signature = request.body.signatures;
    console.log("kkkkkkkkkkkkkkkkkkkkk", request.body.signatures);
    if (request.session.userId) {
        if (signature) {
            request.session.signed == "true";
            console.log("....petition already signed");
        } else {
            return response.redirect("/petition");
        }
        // console.log("....petition not signed");
        db.postPetition(signature, request.session.userId)
            .then(({ rows }) => {
                console.log("rows", rows);
                // response.cookie('signed', 'true');
                request.session.signed = "true";
                console.log("............redirect post petition");
                return response.redirect("/thanks");
            })
            .catch(e => {
                console.log("index.petition.postPetition", e);
                response.render("petition", {
                    error: true
                });
            });
        console.log("in petition post");
    } else {
        console.log("in else not logged in ");
        return response.redirect("/login");
    }
});

app.get("/thanks", (req, res) => {
    console.log("............in thanks");

    let usersignId = req.session.userId;
    let renderingObject = {};

    console.log("//////////    ", usersignId);
    if (usersignId == "") {
        console.log("thanks:::not_Logged in redirect to login");
        return res.redirect("/login");
    }
    // console.log("thanks::Logged in redirect to login");
    db.signId(usersignId)
        .then(({ rows }) => {
            console.log("first row:", rows);
            renderingObject.signature = rows[0].signature;
        })
        .then(
            db.getNumSigners().then(({ rows }) => {
                console.log("getnum rows: ", rows[0].count);
                renderingObject.count = rows[0].count;
                res.render("thanks", renderingObject);
            })
        )
        .catch(e => {
            console.log("sssss");
            console.log(e);
        });
    // });
});

app.get("/registration", (req, res) => {
    res.render("registration");
});

app.post("/registration", (request, response) => {
    let first = request.body.first;
    let last = request.body.last;
    let email = request.body.email;
    let userPassword = request.body.password;

    bcrypt.hash(userPassword).then(result => {
        console.log(result);
        db.postRegistration(first, last, email, result) //password already encrypted as result
            .then(({ rows }) => {
                console.log("rows----", rows[0].id);
                request.session.userId = rows[0].id;
                request.session.loggedIn = "true";
                console.log("userId:", request.session.userId);
                response.redirect("/profile");
            })
            .catch(e => {
                console.log(e);
                response.render("registration", {
                    error: true
                });
            });
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (request, response) => {
    console.log("................ inside login");
    let userId;
    let { password, email } = request.body;
    db.login(email)
        .then(result => {
            // console.log("................ inside login::: first then", result);
            let { id, hash } = result.rows[0];
            userId = id;
            console.log("......>>>>....", userId, hash);

            return bcrypt.compare(password, hash).then(result => {
                console.log(result);
                return result;
            });
        })
        .then(authorised => {
            "................ auth inside login::: 2nd thllllllen";
            if (!authorised) {
                return response.render("login", { error: true });
            }
            request.session.loggedIn = "true";
            request.session.userId = userId;
        })
        .then(() => {
            db.getSign(userId)
                .then(result => {
                    console.log("-------bbbbb-----------", userId);
                    console.log(result);
                    console.log("------------------");
                    if (result.rows.length > 0) {
                        // let { signature } = rows[0];
                        request.session.signed = "true";
                        console.log("//......thanks");
                        response.redirect("/thanks");
                    } else {
                        console.log("......//..petition");
                        response.redirect("petition");
                    }
                })
                .catch(e => {
                    console.log("llllllll", e);
                });
            console.log("................ inside login::: 2nd then");
        })
        .catch(e => {
            console.log(e);
            response.render("login", {
                error: true
            });
        });
});

app.get("/profile", (request, response) => {
    response.render("profile");
});

app.post("/profile", (request, response) => {
    let { age, city, url } = request.body;
    let user_id = request.session.userId;
    // const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    // if (url && !regexp.test(url)) {
    //     url = "";
    // }
    console.log("validator----", url);
    console.log("city:", city);
    if (age || city || url) {
        db.addProfile(parseInt(age), city, url, user_id)
            .then(result => {
                console.log("result:---", result);
                response.redirect("/petition");
            })
            .catch(e => {
                console.log("in post.profile", e);
                response.redirect("/petition");
            });
    } else {
        response.redirect("/petition");
    }
});

app.get("/signers", (request, response) => {
    db.signers()
        .then(({ rows }) => {
            response.render("signers", { data: rows });
        })
        .catch(e => {
            console.log(e);
        });
});

app.get("/signers/:city", (request, response) => {
    const { city } = request.params;
    db.signers(city)
        .then(({ rows }) => {
            response.render("signers", { data: rows });
        })
        .catch(e => {
            console.log(e);
        });
});

app.get("/profile/editprofile", (request, response) => {
    let user_id = request.session.userId;
    db.showProfile(user_id)
        .then(({ rows }) => {
            console.log(rows);
            response.render("editprofile", {
                first: rows[0].first,
                last: rows[0].last,
                email: rows[0].email,
                age: rows[0].age,
                city: rows[0].city,
                url: rows[0].url
            });
        })
        .catch(e => {
            console.log(e);
        });
});

app.post("/profile/editprofile", (request, response) => {
    let user_id = request.session.userId;
    let { first, last, email, age, city, url, password } = request.body;
    console.log("in profile edit", first, last, email, age, city, url);

    bcrypt.hash(password).then(hash => {
        if (!password) {
            hash = null;
        }
        db.updateUser(first, last, email, hash, user_id)
            .then(() => {
                console.log("hash**********", hash);
                console.log("update successful");
            })
            .then(() => {
                db.addProfile(age, city, url, user_id).then(() => {
                    response.redirect("/thanks");
                });
            })
            .catch(e => {
                console.log("=================update user", e);
                response.redirect("/profile/editprofile");
            });
    });
});
app.post("/signatures/delete", (req, res) => {
    res.redirect("/petition");
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/registration");
});
// //////////dummie routes///
// app.get("/welcome", (req, res) => {
//     res.send("<h1>welcome to my website</h1>");
// });
//
// app.post("/welcome", (req, res) => {
//     req.session.wasWelcomed = true;
//     res.redirect("/home");
// });
//
// app.get("/home", (req, res) => {
//     if (!req.session.wasWelcomed) {
//         return res.redirect("/welcome");
//     }
//     res.send("<h1>home</h1>");
// });
// //////dummie routes////

// if (require.main === module) {
app.listen(process.env.PORT || 8080, () =>
    console.log("petition project listening...")
);
// }

// app.get('*', (req, res) => {
//     req.session.cohort = 'coriander';
//     console.log('req.sessionin / test before redirect:', req.session);
//     res.redirect('/');
// });
