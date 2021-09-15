const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const logger = require('./log/logger');
require('./db/mongo');
//const mongoose = require('mongoose');
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
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(err.status || 500 ).json(err);
});

// mongoose.connect(`mongodb://localhost:27018/instafeed', { useNewUrlParser: true }`)
//         .then(() => {console.log("MongoDB connected..."); app.emit('ready');})
//         .catch(err => {console.log("Could not connect to MongoDB. Terminating...");console.log(err);process.exit()});

//app.on('ready', async function() { 
    app.listen(port, hostname, () =>{
        console.log(`Server running at http://${hostname}:${port}/`);
    });
//});


