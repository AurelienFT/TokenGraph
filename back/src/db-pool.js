const { Pool } = require('pg');

const useSsl =
  // process.env.NODE_ENV === 'production';
  true;

const connectionString = process.env.DATABASE_URL || (`postgresql://${
  process.env.DB_USER}:${
  process.env.DB_PASSWORD}@${
  process.env.DB_HOST}:${
  process.env.DB_PORT}/${
  process.env.DB_DATABASE}`);

const dbPool = new Pool({
  connectionString: connectionString,
  ssl: useSsl,
});

module.exports = dbPool;