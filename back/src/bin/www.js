#!/usr/bin/env node

/**
 * Module dependencies.
 */
 require('debug');
 const http = require('http');
 
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
 
 /**
 * Create HTTP server.
 */
 const server = http.createServer(app);
 
 server.listen(port, () => {
   console.log(`Server listening on ${port}`)
 })