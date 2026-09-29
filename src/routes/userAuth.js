const express = require('express');
const authRouter = express.Router();
const {register,login,logout} = require('../controllers/userAuth')
const userMiddleware = require('../middleware/userMiddleware');

// Register Route
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);

module.exports = authRouter;