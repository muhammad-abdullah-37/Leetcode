const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');
require('dotenv').config({quiet : true});

const adminMiddleware = async (req,res,next) => {
    try {
        // Extracting and checking the token
        const {token} = req.cookie;
        if (!(token)) {
            throw new Error('Token is not present')
        }

        // verifying the token and getting the payload and id from the payload
        const payload = jwt.verify(token,process.env.SECRET_KEY_FOR_COOKIE);
        const {_id} = payload ;
        if (!(_id)) {
            throw new Error('Invalid Token')
        }

        // Checking that User exists or not in DB
        const targetUser = await User.findById(_id);
        if (!(targetUser)) {
            throw new Error("User Doesn't Exist ")
        }
        // Checking that user is admin or not
        if (!(targetUser.role != 'admin')) {
            throw new Error('Invalid Token')
        }
        // Checking that user is in the Redis block list or not
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error('Invalid Token')
        }
        req.targetUser = targetUser;
        next()
    } catch (error) {
        
    }
}

module.exports = adminMiddleware;