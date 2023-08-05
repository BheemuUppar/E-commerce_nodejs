const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const user = require('../models/User');
const environment = require('../../config/environment');

const saltRounds = environment.saltRounds;

router.post("/register", (req, res) => {
  //  console.log(req.body);
  let obj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    role: req.body.role,
  };
  
  if (checkProperties(obj)) {
   const isUserExist =  chechDuplicateUser(obj.email , obj.mobile);
   if(!isUserExist){
     bcrypt.hash(obj.password, saltRounds, async (err, hashedPassword) => {
      if (!err) {
        obj.password = await  hashedPassword;
         await user.create(obj)
            res.status(201).send({"status":"OK"})
    } else {
          console.log("hash error!");
          res.status(500).send("Error hashing password");
      }
    });
   }
   else{
    res.status(409).json({ message: 'User already registered' });
   }
  } else {
    res.send("Properties Required!");
  }
});
router.post("/login", (req, res) => {
//  let username = req.body
});



async function chechDuplicateUser(email, mobile){
   let res  = await user.find({$or:[{mobile:mobile}, {email:email} ]});
      if(res.length>=1){
        return true;
      }
      else{
        return false;
      }

}
function checkProperties(obj){
    for (var key in obj) {
        if (!obj[key]) {
          return  false;
        }
      }
      return true;
}

module.exports = router;
