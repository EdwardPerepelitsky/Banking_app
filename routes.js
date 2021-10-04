const express = require('express');
const db = require('./queries');
const gq  = require('./games_queries');
const cors = require('cors');
const usersRouter = require('./users_routes');
const https = require('https');
const http = require('http');
const session = require('express-session');
const crypto = require('crypto');
require('dotenv').config();
const pgSession = require('connect-pg-simple')(session);
fs = require('fs');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST');
    next();
});


app.use(cors({
    origin: true,
    credentials: true,
}));


app.use(express.urlencoded({extended: true}));
app.use(express.json());

let secret = process.env.NAME || crypto.randomBytes(128).toString('hex');
let name = process.env.SECRET || crypto.randomBytes(128).toString('hex');


app.use(session({
    secret: secret,
    name: name,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 600000
    },
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: new pgSession({
        pool: db.pool,
        tableName: 'session'
    })
}));



app.use('/users', usersRouter);

const options = {
    key: fs.readFileSync('./certs/localhost-key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem')
};

const server = https.createServer(options, app);



const PORT =  process.env.PORT || 3000;
server.listen(PORT, () => {console.log('Server is listening on port ' + PORT)})
//app.listen(PORT, () => {console.log('Server is listening on port ' + PORT)})
