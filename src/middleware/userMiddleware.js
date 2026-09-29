const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');



const userMiddleware = async(req,res,next) => {
    try {
        // Extracting token from the cookies
        const {token} = req.cookies;
        // Checking is Token valid or not
        if (!(token)) {
            throw new Error('Invalid Token')
        }
        // verifying the token and payload
        const payload = jwt.verify(token,process.env.SECRET_KEY_FOR_COOKIE);
        const {_id} = payload;
        // Extracting the id from payload
        if (!(_id)) {
            throw new Error('Invalid Token')
        }
        // Finding user in DB using the id
        const result = User.findById(_id);
        if (!(result)) {
            throw new Error("User Doesn't Exist")
        }
        // Checking that token is present in the Redis blocklist or not
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error('Invalid Token')
        }
        res.result = result;
        next()
    } catch (error) {
        res.status(401).send(`Error in token validation : ${error.message}`)
    }
}

module.exports = userMiddleware;