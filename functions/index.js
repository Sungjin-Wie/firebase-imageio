const functions = require('firebase-functions');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var busboyRouter = require('./busboy');
var admin = require('firebase-admin');


var serviceAccount = require('./auth.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-4-c4862.firebaseio.com",
  storageBucket: "gs://fir-4-c4862.appspot.com"
});

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', busboyRouter);

app.use(function(req, res, next) {
  next(createError(404));
});



app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


const api = functions.https.onRequest(app);

module.exports = {
    api
};