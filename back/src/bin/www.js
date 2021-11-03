#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('debug');
const http = require('http');
const https = require('https');

require('dotenv').config();

const app = require('../app.js');

/**
* Normalize a port into a number, string, or false.
*/
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

/**
* Get port from environment and store in Express.
*/
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var privateKey  = fs.readFileSync('/etc/letsencrypt/live/olta.fr/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/olta.fr/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/**
* Create HTTP server.
*/
if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'production') {
  const server = https.createServer(credentials, app);

  server.listen(port, () => {
    console.log(`Server https listening on ${port}`)
  })
} else {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server listening on ${port}`)
  })
}