const express = require('express');
const authRouter = express.Router();
const {register,login,logout,adminRegister,deleteProfile} = require('../controllers/userAuth')
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/userMiddleware');
const { default: isEmail } = require('validator/lib/isEmail');

// Register Route
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
// Authentication Checking for a registered user on every visit
authRouter.get('/check',userMiddleware,(req,res) => {
    const reply = {
        firstName: req.result.firstName,
        emailId  : req.result.emailId,
        _id      : req.result._id
    }
    res.status(200).json({
        user:reply,
        message: "Valid User"
    })
})

module.exports = authRouter;