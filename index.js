const express = require("express");
const app = express();
const hb = require("express-handlebars");
// const cookieParser = require('cookie-parser');
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
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        csrfToken: req.csrfToken()
    });
});

// app.use(cookieParser());

//checking cookies,if not present
app.post("/petition", (request, response) => {
    console.log("............in post petition");
    let first = request.body.first;
    let last = request.body.last;
    let signature = request.body.signatures;
    // let userId = request.session.userId;

    if (request.session.userId) {
        if (request.session.signed == "true") {
            console.log("....petition already signed");
            return response.redirect("/thanks");
        }
        // console.log(first, last, signature);
        console.log("....petition not signed");

        db.postPetition(first, last, signature, request.session.userId)
            .then(({ rows }) => {
                console.log("rows", rows);
                // response.cookie('signed', 'true');
                request.session.signed = "true";
                console.log("............redirect post petition");

                return response.redirect("/thanks");
            })
            .catch(e => {
                console.log(e);
                response.render("petition", {
                    error: true
                });
            });
        console.log("in ptition post");
    } else {
        console.log("in else not logged in ");
        return response.redirect("/login");
    }
});

app.get("/thanks", (req, res) => {
    console.log("............in thanks");

    let usersignId = req.session.userId;
    console.log("//////////    ", usersignId);
    if (usersignId == "") {
        console.log("thanks:::not_signed in redirect to login");
        return res.redirect("/login");
    }
    console.log("aaaaammmmmmmmmmmmmmmmmmmmm here");
    db.signId(usersignId)
        .then(({ rows }) => {
            console.log("first row:", rows);
            res.render("thanks", {
                // first: rows[0].first,
                signature: rows[0].signature
            });
        })
        .catch(e => {
            console.log("ssssssssssssssssssssssssssssss");
            console.log(e);
        });
    // });
});

app.get("/signers", (req, res) => {
    db.getPetition().then(result => {
        console.log(result);
        console.log("--------------------");
        res.render("signers", {
            data: result.rows
        });
    });
});

app.get("/registration", (req, res) => {
    res.render("registration");
});

app.post("/registration", (request, response) => {
    let first = request.body.first;
    let last = request.body.last;
    let email = request.body.email;
    let userPassword = request.body.password;
    // let hashedPassword = "";
    bcrypt.hash(userPassword).then(result => {
        console.log(result);
        // return result;
        db.postRegistration(first, last, email, result) //password already encrypted as result
            .then(({ rows }) => {
                console.log("rows----", rows[0].id);
                request.session.userId = rows[0].id;
                request.session.loggedIn = "true";
                console.log("userId:", request.session.userId);
                response.redirect("/petition");
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
            // get user data from database
            // set the cookie that indicates that the user is logged in
            request.session.loggedIn = "true";
            request.session.userId = userId;
            // return the user id to the then statement
        })
        .then(userId => {
            db.getSign(userId)
                .then(result => {
                    console.log("------------------");
                    console.log(result.rows);
                    console.log("------------------");
                    if (result.rows.length > 0) {
                        // let { signature } = rows[0];
                        request.session.signed = "true";
                        console.log("//././..thanks");
                        return response.redirect("/thanks");
                    } else {
                        console.log("//././..petition");
                        return response.redirect("petition");
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

// app.post("/profile", (request, response) => {});

app.get("/editprofile", (request, response) => {
    response.render("editprofile");
});

app.get("logout", function(req, res) {
    req.session = null;
    res.redirect("/register");
});

app.listen(process.env.PORT || 8080, () =>
    console.log("petition project listening...")
);

// app.get('/test', (req, res) => {
//     req.session.signId = 10;
//     console.log('req.sessionin / test before redirect:', req.session);
//     res.redirect('/');
// });
// app.get('/logout')
// req.session =null
//
// app.get('*', (req, res) => {
//     req.session.cohort = 'coriander';
//     console.log('req.sessionin / test before redirect:', req.session);
//     res.redirect('/');
// });
