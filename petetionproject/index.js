const express = require('express');
const app = express();
const hb = require('express-handlebars');
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const db = require('./database');
const csurf = require('csurf');

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
    console.log('req.sessionin /route');
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
            return response.render("petition", {
                error: true
            });
        });

});


app.get('/thanks', (req, res) => {
    // res.render('thanks');
    let usersignId = req.session.userId;
    // let renderObject = {};
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

app.get('/login', (req, res) => {
    res.render('login');
});

// app.post('/registration', (req, res) => {
//get their stored hashed password by their email address
//compare the password they typed to the hash from the db
//if there's a match
//log them in
//do a query to find out if they signed
//redirect to petition
//if there is not a match, then re-render form with error msg
// });

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