const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieParser = require('cookie-parser');
const db = require('./database');

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('./public'));
app.use(
    express.urlencoded({
        extended: false
    })
);
app.get('/', (req, res) => {
    res.redirect('/petition');
});

app.get('/petition', (req, res) => {
    res.render('petition');
});

app.use(cookieParser());


//checking cookies,if not present
app.post('/petition', (request, response) => {
    // get variables from POST request
    // first, last, signature
    if (!request.cookies.signed) {
        let error,
            resolve = db.postPetition(request.body.first, request.body.last, "Champa");
        if (error) {
            response.render('petition', {
                error: true
            });
        } else {
            response.cookie("signed", "yes");
            response.redirect('/thanks');
        }
    }
});


app.get('/thanks', (req, res) => {
    res.render('thanks');
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

app.listen(8080, () => console.log("petition project listening..."));