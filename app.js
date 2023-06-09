var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { usr } = require('./models/User');

const mongoose = require('mongoose');
//get your connection string from the .env file
const CONNECTION_STRING = process.env.CONNECTION_STRING;

// setup connection to mongo
mongoose.connect(CONNECTION_STRING);
const db = mongoose.connection;

// recover from errors
db.on('error', console.error.bind(console, 'connection error:'));

var indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth')
const pathsRouter = require('./routes/paths')

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/api/paths', pathsRouter)

// dynamic routing posts subdirectory
app.get('/posts*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public') + '/index.html');
});


//dynamic routing authentification subdirectory
app.get('/auth*', (_, res) => {
  res.sendFile(path.join(_dirname, 'public') + '/index.html');
})

app.get('/paths*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public') + '/index.html');
});
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
