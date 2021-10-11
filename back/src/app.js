const logger = require('morgan');
const express = require('express');

const dbPool = require('./db-pool.js')
const indexRouter = require('./routes/index.js');

const app = express();

app.set('dbPool', dbPool);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', function(req, res) {
  return res.status(200).json({ ok: Date.now() });
});

app.use('/v1', indexRouter);

module.exports = app;