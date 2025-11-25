const express = require('express');
const router = express.Router();
const usermodel = require('../models/usermodel');
const postmodel = require('../models/postsmodel');
const userroute = require('../controllers/autocontrollers');
const isloggedin = require('../middlerware/isloggedin');
const upload = require('../multer/multer');


router.get('/',function(req,res){
    let error = req.flash("error");
    res.render('index',{error,});
});

router.get('/login',function(req,res){
    let error = req.flash("error");
    // let success1 = req.flash('success1');
    res.render('login',{error,});
});

router.post('/register',userroute.registeruser);

router.post('/login',userroute.loginuser);

router.get('/profile/:id', isloggedin,userroute.profileuser);

router.get('/feed/:id',isloggedin,userroute.feeduser);

router.get('/search/:id',isloggedin,userroute.searchuser);

router.get('/edit/:id',isloggedin,userroute.editprofileuser);

router.post('/createpost/:id',isloggedin,upload.single("image"),userroute.createuserpost);

router.get('/delete/:id',isloggedin,userroute.deletepost);

router.post("/update/:id",isloggedin,upload.single("image"),userroute.updateprofileuser);

router.get('/upload/:id',isloggedin,userroute.uploadpost);

router.get('/logout',userroute.logoutuser);







module.exports = router;