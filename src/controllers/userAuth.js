const redisClient = require('../config/redis');
const User = require('../models/user')
const validate = require('../utils/validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({quiet : true});
const SECRET_KEY_FOR_COOKIE = process.env.SECRET_KEY_FOR_COOKIE
const Submission = require('../models/submission');

// User Register controller
const register = async (req,res) => {
    try {
        // Extracting data from request body
        let {emailId,password} = req.body;
        // data validation
        await validate(req.body);
        // password hashing
        const hashedPassword = await bcrypt.hash(password,10);
        req.body.password = hashedPassword;
        req.body.role = 'user';
        // User Registeration
        const registeredUser = await User.create(req.body)
        // Token creation an sending while registering the user
        const token = jwt.sign({_id : registeredUser._id ,emailId : emailId, role:'user'}, SECRET_KEY_FOR_COOKIE, {expiresIn : 60*60})
        res.cookie("token",token,{maxAge :60*60*1000})
        res.status(201).send(`User Registered Successfully`);
    } catch (error) {
        res.status(400).send(`Error : ${error}`)
    }
}

// User Login Controller
const login = async(req,res) => {
    try {
        const {emailId,password} = req.body;
        // Email verification
        if (!(emailId)) {
            throw new Error('Invalid Credentials');
        }
        // Password verification
        if (!(password)) {
            throw new Error('Invalid Credentials')
        }
        // Finding User
        const targetUser = await User.findOne({emailId});
        // Comparing the password before the Login 
        const isLogenAllowed = await bcrypt.compare(password,targetUser.password);
        if (!(isLogenAllowed)) {
            throw new Error('Invalid Credentials');
        }
        // JWT token creation and sending in cookie
        const token = jwt.sign({_id : targetUser._id, emailId : emailId,role:targetUser.role},SECRET_KEY_FOR_COOKIE,{expiresIn : 60*60});
        res.cookie("token",token);
        res.status(200).send('User Logged-In Successfully');
    } catch (error) { 
        res.status(400).send(`Error : ${error}`)
    }
}

// User Logout Controller
const logout = async (req,res) => {
    try {
        // Token validation will be validate in middleware

        // Extracting the token from the cookie
        const {token} =  req.cookies;
        // Extracting payload from the token
        const payload = jwt.decode(token);
        // Adding the token in Redis Blocklist and setting it's expiry time
        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);
        // Sending the Invalid Token in Cookie
        res.cookie("token",null, {expireAt : new Date (Date.now())});
        res.send(`User Logged Out Successfully`)

    } catch (error) {
        res.status(503).send(`Error in Logout :${error.message}`);
    }
}

//Admin register Controller
const adminRegister = async (req,res) => {
      try {
        // Extracting data from request body
        let {emailId,password} = req.body;
        // data validation
        await validate(req.body);
        // password hashing
        const hashedPassword = await bcrypt.hash(password,10);
        req.body.password = hashedPassword;
        req.body.role = 'admin';
        // User Registeration
        const registeredUser = await User.create(req.body)
        // Token creation an sending while registering the user
        const token = jwt.sign({_id : registeredUser._id ,emailId : emailId, role:'user'}, SECRET_KEY_FOR_COOKIE, {expiresIn : 60*60})
        res.cookie("token",token,{maxAge :60*60*1000})
        res.status(201).send(`User Registered Successfully`);
    } catch (error) {
        res.status(400).send(`Error : ${error}`)
    }
}

// User Profile delete Controller
const deleteProfile = async(req,res) => {
    try {
        const userId = req.result._id;
        // Deleting the user from the User Schema
        await User.findByIdAndDelete(userId);
        // Deleting the user data from the submission , mean deleting all the submitted questions
        Submission.deleteMany({userId});
        res.status(200).send(`Profile Deleted Successfully`);
    } catch (error) {
        res.status(500).send(`Erro in User Profile Delettion : ${error.message}`)
    }
}
module.exports = {register,login,logout,adminRegister,deleteProfile};

