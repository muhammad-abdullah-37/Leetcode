const dns = require('dns');
dns.setServers(['8.8.8.8','1.1.1.1']);
require('dotenv').config({quiet : true});
const mongoose = require('mongoose');


// MongoDB connection
async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB Connection Successful`);
    } catch (error) {
        console.log(`Error in DB Connection : ${error}`);
    }
}

module.exports = main;