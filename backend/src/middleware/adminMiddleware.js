const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');
require('dotenv').config({quiet : true});

const adminMiddleware = async (req,res,next) => {
    try {
        // Extracting and checking the token
        const {token} = req.cookies;
        if (!(token)) {
            throw new Error('Token is not present')
        }

        // verifying the token and getting the payload and id from the payload
        const payload = jwt.verify(token,process.env.SECRET_KEY_FOR_COOKIE);
        const {_id} = payload ;
        if (!(_id)) {
            throw new Error('Invalid Token 1')
        }

        // Checking that User exists or not in DB
        const result = await User.findById(_id);
        if (!(result)) {
            throw new Error("User Doesn't Exist ")
        }
        // Checking that user is admin or not
        if (result.role != 'admin') {
            throw new Error('Invalid Token 2')
        }
        // Checking that user is in the Redis block list or not
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error('Invalid Token 3')
        }
        req.result = result;
        next()
    } catch (error) {
        res.send(`Error in Admin Middleware : ${error}`);
    }
}

module.exports = adminMiddleware;