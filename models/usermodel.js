const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/instagram');

const userschema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileimage:String,
  bio: String,
  picture: {
    type: String,
    default: "def.png"
  },
  contact: String,

  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "story" 
    }
  ],
  saved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post" 
    }
  ],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post" 
  }],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user" 
    } 
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user" 
    }
  ]
})

module.exports = mongoose.model("user", userschema);
