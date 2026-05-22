const mongoDb = require('mongoose');

const userSchema = new mongoDb.Schema({
    userEmail: { type:String, required: true, unique: true  },
    userName: { type: String },
    userPassword: { type: String },
    userPhone: { type: String },
    is_verified: { type: Boolean, default: false }
},{ timestamps: true });

module.exports = mongoDb.model("Users", userSchema);