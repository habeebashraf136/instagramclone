const usermodel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const {generatetoken} = require('../utils/generatetoken');
const postmodel = require('../models/postsmodel');
const fs = require('fs');
const path = require('path');
// const { populate } = require('dotenv');


module.exports.registeruser = async (req, res) => {
    try{

        let {username,email,name,password} = req.body;
        let user = await usermodel.findOne({email:email});
        if(user){
            req.flash("error","You already have an account, please login.");
            return res.redirect('/login');
        }

        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err) return res.send(err.message);
                else{
                    let user = await usermodel.create({
                        username,
                        email,
                        name,
                        password:hash
                    });
                    let token = generatetoken(user);
                    res.cookie("token",token);
                    req.flash("success","You Account is created!");
                    return res.redirect(`/feed/${user._id}`);
                }
            });
        });

    }catch (err) {
        res.send(err.message);
    }
};


module.exports.loginuser = async (req, res) => {
    let {username,password} = req.body;

    let user = await usermodel.findOne({username:username});
    if(!user){
        req.flash("error","Email or password is incorrect.");
        return res.redirect('/login');
    }

    
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token = generatetoken(user);
            res.cookie("token",token);
            req.flash("success1","your are login");
            return res.redirect(`/feed/${user._id}`);
        }else{
            req.flash("error","Email or password is incorrect.");
            return res.redirect('/login');
        }
    });
};

module.exports.logoutuser = async (req, res) => {
    res.cookie("token","");
    req.flash("success","You have logged out!");
    res.redirect('/login');
};

module.exports.profileuser = async (req, res) => {
    let user = await usermodel.findOne({_id:req.params.id}).populate("posts")
        .populate("saved"); 
        let error = req.flash("error");
        res.render('profile',{user,error});
};

module.exports.editprofileuser = async (req, res) => {
    let user = await usermodel.findOne({_id:req.params.id});
    let error = req.flash("error");
    res.render('edit',{user,error});
};

module.exports.feeduser = async (req, res) => {
    let posts = await postmodel.find().populate("user");
    let user = await usermodel.findOne({_id:req.params.id});
    let allusers = await usermodel.find();
    let error = req.flash("error");
    let success = req.flash("success");
    let success1 = req.flash('success1');
    res.render('feed',{posts,user,allusers,error,success,success1});
};

module.exports.uploadpost = async (req, res) => {
    let user = await usermodel.findOne({_id:req.params.id});
    res.render('upload',{user});
};

module.exports.deletepost = async (req, res) => {
    try {
  const post = await postmodel.findOne({ _id: req.params.id });

  if (!post) return res.send("Post not found");

  // ONLY DELETE IMAGE IF IT EXISTS
  if (post.image) {
    const imagePath = path.join(__dirname, "../public/images/uploads", post.image);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // REMOVE POST FROM USER POSTS ARRAY
  await usermodel.updateOne(
    { _id: post.user },
    { $pull: { posts: post._id } }
  );

  // REMOVE POST FROM DB
  await postmodel.findOneAndDelete(req.params.id);

  res.redirect(`/profile/${user._id}`);

} catch (error) {
  console.log(error);
//   res.send(error);
}
};

module.exports.updateprofileuser = async (req, res) => {
  let user = await usermodel.findOneAndUpdate(
    { _id: req.params.id },
    {
      username: req.body.username,
      name: req.body.name,
      bio: req.body.bio,
    },
    { new: true }
  );

  if (req.file) {
    user.profileimage = req.file.filename;
    await user.save();
  }

  res.redirect(`/profile/${user._id}`);
};


module.exports.createuserpost = async (req, res) => {
    const user = await usermodel.findOne({_id:req.params.id});
    const post = await postmodel.create({
        picture:req.file.filename,
        user:user._id,
        caption:req.body.caption,
    })
    user.posts.push(post._id);
    await user.save();
    res.redirect(`/feed/${user._id}`);
};

module.exports.searchuser = async (req, res) => {
    let user = await usermodel.findOne({_id:req.params.id});
     let error = req.flash("error");
    res.render('search',{user,error});
};
