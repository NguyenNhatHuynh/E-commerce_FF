const express = require("express")
const router = express.Router()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config()
const account = require("../../models/accountuser")
const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    let result = "";
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  };
passport.use(new GoogleStrategy({
    
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email'] 
  },  (accessToken, refreshToken, profile, cb) => {

    return cb(null,profile)
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID_FB,
    clientSecret: process.env.CLIENT_SECRET_FB,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['email','photos','id','displayName'],    
  }, (accessToken, refreshToken, profile, cb) => {
     console.log(profile)
     cb(null, profile);
  }));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

    router.get('/google', passport.authenticate('google'), function(req, res, next) {
        res.render('login');
      });
    router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async function(req, res) {
        // Ở đây, req.user chứa thông tin người dùng đã được xác thực
        const profile = req.user;
        const datagoogle = await account.findOne({
            email : profile.emails[0].value
        })
        console.log(datagoogle)
        if(datagoogle){
            res.cookie("tokenuser", datagoogle.tokenuser);
    
        }
        else{
            const infor = {
                fullName : profile.displayName,
                email : profile.emails[0].value,
                tokenuser : generateRandomString(30),
            }
            const newdata = new account(infor)
            await newdata.save()
            res.cookie("tokenuser", newdata.tokenuser);
    
        }
       
        res.redirect('/');
    });

    router.get('/facebook', passport.authenticate('facebook', {seasion : false , scope : ["email"]}), function(req, res, next) {
        res.render('login');
      });


router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), async function(req, res) {
    const profile = req.user;
    console.log(profile)
    const datafacebook = await account.findOne({
        email : profile.emails[0].value
    })
    console.log(datafacebook)
    if(datafacebook){
        res.cookie("tokenuser", datafacebook.tokenuser);

    }
    else{
        const infor = {
            fullName : profile.displayName,
            email : profile.emails[0].value,
            tokenuser : generateRandomString(30),
        }
        const newdata = new account(infor)
        await newdata.save()
        res.cookie("tokenuser", newdata.tokenuser);

    }
   
    res.redirect('/');
});


module.exports = router
    