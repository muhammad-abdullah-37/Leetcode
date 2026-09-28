const User = require('../models/user')
const validate = require('../utils/validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({quiet : true});
const SECRET_KEY_FOR_COOKIE = process.env.SECRET_KEY_FOR_COOKIE

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
        // User Registeration
        const registeredUser = await User.create(req.body)
        // Token creation an sending while registering the user
        const token = jwt.sign({_id : registeredUser._id ,emailId : emailId}, SECRET_KEY_FOR_COOKIE, {expiresIn : 60*60})
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
        const token = jwt.sign({_id : targetUser._id, emailId : emailId},SECRET_KEY_FOR_COOKIE,{expiresIn : 60*60});
        res.cookie("token",token);
        res.status(200).send('User Logged-In Successfully');
    } catch (error) { 
        res.status(400).send(`Error : ${error}`)
    }
}

module.exports = {register,login};

