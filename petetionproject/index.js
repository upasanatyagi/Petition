const express = require('express');
const app = express();
const hb = require('express-handlebars');



app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
const cookieParser = require('cookie-parser');
const db = require('./database');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('foo');
});

app.get('/petition', (req, res) => {
    db.getPetition().then(
        ({
            rows
        }) => console.log(rows)
    );
    res.render('petition');
    // res.end();


});


app.post('/petition', (req, res) => {
    //or redirect and cookie id of signature

    //        -if the "INSERT" is successful, redirect to thanks page
    //        -if the "INSERT" fails, render form with error message
    if (postInsert)
        // res.render("thanks");
        res.sendStatus(404);
    //res.render('petition', { error: true });
});

app.get('/thanks', (req, res) => {
    res.render('thanks');
});

app.get('/signers', (req, res) => {
    res.render('signers');
    //  call db function to do query to get first and last names of signers

    //pass the rows array you get back to the signers template
});

app.listen(8080, () => console.log("petition project listening..."));