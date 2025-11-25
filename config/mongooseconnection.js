const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

module.exports = mongoose.connection;

