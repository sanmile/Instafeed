const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const bodyParser = require('body-parser');

require('./db/mongo');
const hostname = 'localhost';
const session = require('express-session');
const app = express();
const port = 8081;

app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./routes'));



app.use((err, req, res, next) => {
    return res.status(err.status || 500 ).json(err);
});

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


