const path = require('node:path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'meu_app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 20,
  connectTimeout: 10000,
});

module.exports = pool;
