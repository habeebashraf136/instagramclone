const mongoose = require('mongoose');
const config = require('config');

// mongoose.connect
// (`${config.get('MONGODB_URI')}/instagram`)
// .then(function(){
//     console.log("connected");
// })
// .catch(function(err){
//     console.log(err);
// });

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

module.exports = mongoose.connection;

