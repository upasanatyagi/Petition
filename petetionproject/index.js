const express = require('express');
const app = express();
const hb = require('express-handlebars');
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const db = require('./database');
const csurf = require('csurf');
const bcrypt = require('./bcrypt');


app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('./public'));
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14 //expiration age,how long cookie to last
}));

app.use(csurf());

app.use((req, res, next) => {
    res.set('x-frame-otions', 'DENY');
    res.locals.csrfToken = req.csrfToken();
    next();
});

// res.cookie('name', 'value', {
//     sameSite: true
// });

app.get('/', (req, res) => {
    // console.log('req.sessionin /route');
    res.redirect('/petition');
});

app.get('/petition', (req, res) => {
    res.render('petition', {
        csrfToken: req.csrfToken()
    });
});

// app.use(cookieParser());


//checking cookies,if not present
app.post('/petition', (request, response) => {
    let first = request.body.first;
    let last = request.body.last;
    let signature = request.body.signatures;
    console.log(first, last, signature);
    db.postPetition(first, last, signature)
        .then(({
            rows
        }) => {
            console.log("rows", rows);
            // response.cookie('signed', 'true');
            request.session.userId = rows[0].id;
            response.redirect('/thanks');
        })
        .catch((e) => {
            console.log(e);
            response.render("petition", {
                error: true
            });
        });

});


app.get('/thanks', (req, res) => {
    let usersignId = req.session.userId;
    db.signId(usersignId)
        .then(({
            rows
        }) => {
            console.log("first row:", rows[0].first);
            res.render('thanks', {
                first: rows[0].first,
                signature: rows[0].signature
            });
        });
});


app.get('/signers', (req, res) => {
    db.getPetition().then(
        result => {
            console.log(result);
            console.log("--------------------");
            res.render('signers', {
                data: result.rows
            });
        }

    );
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.post('/registration', (request, response) => {
    let first = request.body.first;
    let last = request.body.last;
    let email = request.body.email;
    let userPassword = request.body.password;

    bcrypt.hash(userPassword).then(result => {
        console.log(result);
        db.postRegistration(first, last, email, result) //password already encrypted as result
            .then(({
                rows
            }) => {
                console.log("rows", rows);
                request.session.userId = rows[0].id;
                console.log("userId:", request.session.userId);
                response.redirect('/petition');

            })
            .catch((e) => {
                console.log(e);
                response.render("registration", {
                    error: true
                });
            });
    });
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (request, response) => {
    // res.render('login');
    let email = request.body.email;
    let password = request.body.password;
    console.log('email:', email);
    db.login(email)
        .then(({
            rows
        }) => {

            console.log("rows:", rows);

            console.log("request.body.password:", password);
            if (bcrypt.compare(password, rows[0].password)) {
                request.session.userId = rows[0].id;
                console.log("request.session.usersessionId:", request.session.userId);
                db.getSign(rows[0].id).then((result) => {
                    console.log("-------------- password matched:", result);
                    if (result.rows.length < 0) {
                        response.redirect('petition');
                    }
                });
            } else {
                console.log(">>>>>>>failed");
                response.render('login');
            }

        })
        .catch((e) => {
            console.log(e);
            console.log("----------catch-------------");

            response.render("login", {
                error: true
            });

        });
    console.log("-----------------------");
    response.end();
});

app.listen(8080, () => console.log("petition project listening..."));





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