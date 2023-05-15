const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//middleware function for authentication
const {createJWT} = require("../utils/auth");

//check valid email characters using regex
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.signup = (req, res, next) => {
  let { name, email, password, password_confirmation } = req.body;
  let errors = [];

  //a bunch of checks to see if you have entered the required data:

  if (!name) {
    errors.push({ name: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  //check if user exists
  User.findOne({email: email})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "email already exists" }] });
       } else {
         const user = new User({
           name: name,
           email: email,
           password: password,
         });
         bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
         if (err) throw err;
         user.password = hash;
         user.save()
             .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
              });
         });
      });
     }
  }).catch(err =>{
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
  })
}

//both exports used in ../routes/auth.js
exports.signin = (req, res) => {
  let { email, password } = req.body;
  let errors = [];
  if (!email) {
      errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
      errors.push({ email: "invalid email" });
  }
  if (!password) {
      errors.push({ password: "required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({
        errors: [{ user: "not found" }],
      });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({ errors: [{ password: "incorrect" }]});
        }
        let access_token = createJWT(
            user.name,
            user.email,
            user._id,
            3600 //expiration
        );
        //check if the new jwt works
        jwt.verify(access_token, process.env.TOKEN_SECRET, (err,decoded) => {
          if (err) {
            console.log("jwt failed")
            res.status(500).json({ errors: err });
          }
          if (decoded) {
            return res.status(200).json({
                success: true,
                token: access_token,
                message: user
            });
          }
        });
      }).catch(err => {
        console.log("error in bcrypt.compare")
        console.log(err)
        res.status(500).json({errors: err});
      });
    }
  }).catch(err => {
    console.log("error in user.findOne")

    res.status(500).json({ errors: err });
  });
}
