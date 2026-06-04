const express = require('express');
const bcrypt = require("bcrypt");
const User = require('../models/Users.js'); 

const router = express.Router();

router.post('/register', async (req, res ) => {
    try{
        const {userEmail, userName, userPhone, userPassword} = req.body;

        const hashedPass = await bcrypt.hash(userPassword, 10);

        const user = new User({ userEmail, userName, userPhone, userPassword: hashedPass });
        await user.save();
        res.json(user);
    }
    catch (err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;