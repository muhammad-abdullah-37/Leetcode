const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({
    quiet :true,
    path : path.join(__dirname,('../.env'))
});
const PORT = process.env.PORT || 3000
const cookieParser = require('cookie-parser');
const main = require('./config/db');




// Data Parsing using the Middleware
app.use(express.json());
app.use(cookieParser())

// DB Connection Call
main()
.then(()=> {
    app.listen(PORT, () => {
    console.log(`App is Listening at PORT : ${PORT}`);
})
})
.catch((error) => {
    console.log(`Error in DB Connection : ${error}`);
})
