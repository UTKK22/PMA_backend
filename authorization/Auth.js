// const userModel = require('../models/User')
// const jwt = require('jsonwebtoken');

// const isAuthenticated = async (req, res, next) => {
//     // console.log("Incoming request cookies:", req.cookies);
//     const token = req.cookies.token;
//       console.log("token in auth ",token)
//     if (!token) {
//         return res.status(401).json({ message: 'No token found!!' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded._id).select('-password -refreshToken');
//         if (!user) {
//             return res.status(401).json({ message: 'Authentication token is expired or invalid.' });
//         }
//         req.user = user;
//         // console.log("requset user",req.user)
//         next();
//     } catch (error) {
//         // console.error(error);
//         return res.status(401).json({ message: 'Token is invalid' });
//     }
// };

// module.exports = {isAuthenticated};

const userModel = require('../models/User');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id).select('-password -refreshToken');
        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired authentication token' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({ message: 'Authentication token is expired or invalid' });
    }
};

module.exports = { isAuthenticated };
