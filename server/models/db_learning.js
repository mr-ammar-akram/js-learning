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
    console.log("Connected to database");
    await client.query("SELECT NOW()");
    return client; 
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw new Error("Error connecting to the database");
  }
}

// create user table
async function createUserTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL UNIQUE,
      user_name VARCHAR(255) NOT NULL,
      user_phone VARCHAR(20) NOT NULL UNIQUE,
      user_password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const client = await pool.connect();

  try {
    const result = await client.query(query);
    console.log("User table created successfully");
    return result;
  } finally {
    client.release(); 
  }
}

module.exports = { pool, connectDb, createUserTable };
