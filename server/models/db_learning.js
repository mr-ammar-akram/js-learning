const { Pool } = require('pg');
require('dotenv').config();

// Create a pool instead of a single Client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for secure connections to Neon
  },
  max: 10,                     // Keeps the connection count low
  idleTimeoutMillis: 30000,    // Closes idle clients before Neon forces them shut
});

// Vital: Catch any background connection drops safely without crashing Node
pool.on('error', (err) => {
  console.error('Unexpected error on idle Neon database client:', err.message);
});

// connect to postgres database
async function connectDb() {
  try {
    const client = await pool.connect()
    await client.query("SELECT NOW()");
    return client; 
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw new Error("Error connecting to the database");
  }
}

module.exports = { pool, connectDb };
