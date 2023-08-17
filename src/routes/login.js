const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const user = require('../models/User');
const environment = require('../../config/environment');
const jwt = require("jsonwebtoken");
const verifyToken = require('../middlewares/middleware')
const saltRounds = environment.saltRounds;

router.post("/register",async (req, res) => {
  let obj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    role: req.body.role,
  };
  
  if (checkProperties(obj)) {
   const isUserExist = await chechDuplicateUser(obj.email , obj.mobile);
   if(!isUserExist){
     bcrypt.hash(obj.password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        res.status(500).send("Error hashing password");
    } else {
          obj.password = await  hashedPassword;
          await user.create(obj)
             res.status(201).send({"status":"OK"})
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
router.post("/login", async (req, res) => {
//  let username = req.body
const {email, password} = req.body;

const dbUser =await user.find({email:email});
    if(dbUser && dbUser.length>0){
      bcrypt.compare(password , dbUser[0].password, async (err,  result)=>{
      //  let temp=  await result;
        if(result){
          const token = jwt.sign({ userId:dbUser[0].email}, environment.JWT_SECRETE_KEY,{ expiresIn: '30m' });
           res.status(200).send(
            {
              "success": true,
              "message": "User is valid",
              "token": token
              
            }
           )
          }
          else if(!result){
          res.status(409).send(
            {
              "success": false,
              "message": "User is Not valid",
            }
          );
        }
        else{
          res.status(500).send({status:"Internal server Error"});
        }
      })
    }
    else{
      res.status(404).send("User Not Found!");
      res.end()
    }
});


router.post('/verifyToken', verifyToken )

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

function isUserAthenticated(){

}



module.exports = router;
