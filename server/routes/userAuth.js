const express = require('express');
const bcrypt = require("bcrypt");
const pool = require('../models/db_learning'); 

const router = express.Router();

router.post('/register', async (req, res ) => {
    try{
        const {userEmail, userName, userPhone, userPassword} = req.body;
        
        const client = await pool.connectDb();
        try {
        // creating the user table
            const tableStatus = await pool.createUserTable();
            const hashedPass = await bcrypt.hash(userPassword, 10);
            const query = `
            INSERT INTO users (userEmail, userName, userPhone, userPassword)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `;
            console.log("Query:", query);

            const result = await client.query(query, [
            userEmail,
            userName,
            userPhone,
            hashedPass
            ]);

            console.log("Inserted User:", result.rows[0]);

            res.json(result.rows[0]);
        } finally {
            client.release();
        }
    }
    catch (err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;