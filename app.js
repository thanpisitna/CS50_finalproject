var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var connect = require('./db');
var session = require('express-session');

var flash = require('express-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cupboardRouter = require('./routes/cupboard');
var slotRouter = require('./routes/slot');
var historyRouter = require('./routes/history');
var drugRouter = require('./routes/drug');
var serverApiRouter = require('./routes/serverApi');

const { Cookie } = require('express-session');

var app = express();
var cors = require('cors')
app.use(flash());

app.use(cors())

// var corsOptions = {
//   origin: 'http://localhost:3030',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cupboard', cupboardRouter);
app.use('/slot', slotRouter);
app.use('/history', historyRouter);
app.use('/drug', drugRouter);
// , cors(corsOptions)
app.use('/serverApi' , serverApiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
