const express = require('express');
const authRouter = express.Router();
const {register,login,logout,adminRegister} = require('../controllers/userAuth')
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/userMiddleware');

// Register Route
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister)

module.exports = authRouter;