var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { createServer } = require('node:http');

require('./config/db'); // initializes SQLite connection + creates table

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1/habits', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message,
      ...(req.app.get('env') === 'development' && { stack: err.stack }),
    },
  });
});

const server = createServer(app);

server.listen(process.env.PORT, '127.0.0.1', () => {
  console.log(`Listening on ${process.env.PORT}`);
});

module.exports = app;