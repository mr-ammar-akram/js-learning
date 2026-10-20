// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//     const token = req.headers['authorization'];

//     if (!token) return res.status(401).json({
//         status_code: 401,
//         status: "error",
//         message: "No token provided",
//         data: [],
//     });

//     try {
//         const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
//         req.admin = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({
//             status_code: 401,
//             status: "error",
//             message: "Invalid token",
//             data: [],
//         });
//     }
    
// }
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    const token =
        req.headers["authorization"];

    if (!token) {

        return res.status(401).json({
            status_code: 401,
            status: "error",
            message: "No token provided",
            data: []
        });

    }

    try {

        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            status_code: 401,
            status: "error",
            message: "Invalid token",
            data: []
        });

    }

};