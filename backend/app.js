const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./config/db'); // initializes SQLite connection + creates table

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1/habits', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || (status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR'),
      message: err.message,
    },
  });
});

module.exports = app;