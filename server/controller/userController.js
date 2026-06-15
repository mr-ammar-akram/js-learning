const UserModel = require('../models/userModel');

class UserController {
    static async  registerUser (req, res) {
        const {userEmail, userName, userPhone, userPassword} = req.body;
        // Basic Validation
        if (!userEmail || !userName || !userPhone || !userPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        try{
            const newUser = await UserModel.createUser(
                userEmail, 
                userName, 
                userPhone, 
                userPassword    
            );
            
            return res.status(200).json({
                message: 'User registered successfully.',
                user: newUser,
            });
 
        }catch(err){
            if (err.code === '23505') {
                return res.status(400).json({ message: "User already exists" });
            }
            res.status(500).json({ error: err.message });
        }   
    }
    
}

module.exports = UserController;