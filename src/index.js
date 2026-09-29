const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({quiet :true,path : path.join(__dirname,('../.env'))});
const PORT = process.env.PORT || 3000
const cookieParser = require('cookie-parser');
const main = require('./config/db');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');




// Data Parsing using the Middleware
app.use(express.json());
app.use(cookieParser())


// API Mounting
app.use('/user',authRouter);
// app.use('/problem',problemRouter)


const initializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()])
        console.log(`DB Connection Successful`);
        app.listen(PORT, () => {
        console.log(`App is Listening at PORT : ${PORT}`);
})
    } catch (error) {
        console.log(`Error In Connections : ${error}`);
    }
}
// DB Connection Call
initializeConnection()
