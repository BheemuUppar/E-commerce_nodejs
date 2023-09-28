const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const user = require("../models/User");
const environment = require("../../config/environment");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");
// const verifyToken = require('../middlewares/middleware')
const saltRounds = environment.saltRounds;

router.post("/register", async (req, res) => {
  let obj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    role: req.body.role,
    loginType: req.body.loginType,
  };

  if (checkProperties(obj)) {
    const isUserExist = await chechDuplicateUser(obj.email, obj.mobile);
    if (!isUserExist) {
      bcrypt.hash(obj.password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          res.status(500).send("Error hashing password");
        } else {
          obj.password = await hashedPassword;
          await user.create(obj);
          res.status(201).send({ status: "OK" });
        }
      });
    } else {
      res.status(409).json({ message: "User already registered" });
    }
  } else {
    res.send("Properties Required!");
  }
});
router.post("/login", async (req, res) => {
  //  let username = req.body
  const { email, password, loginType } = req.body;
//  console.log('payload', req.body)
  if (!(email && loginType)) {
    res.status(402).json({ message: "Payload Not Valid" });
    res.end()
    return
  }

  const dbUser = await user.find({ email: email });
  // console.log('dbarray', dbUser)
  if (dbUser && dbUser.length > 0 && loginType == "password") {
    bcrypt.compare(password, dbUser[0].password, async (err, result) => {
      //  let temp=  await result;
      if (result) {
        const token = jwt.sign(
          { userId: dbUser[0].email },
          environment.JWT_SECRETE_KEY,
          { expiresIn: "30m" }
        );
        res.status(200).send({
          success: true,
          message: "User is valid",
          token: token,
        });
      } else if (!result) {
        res.status(409).send({
          success: false,
          message: "User is Not valid",
        });
      } else {
        res.status(500).send({ status: "Internal server Error" });
      }
    });
  } 
  else if ( email && loginType == "gmail") {
    
    let tempUser = await user.find({ email: email });
    console.log('temp user ', tempUser)
    console.log(tempUser)
    if (tempUser.length >= 1) {
      res.status(200).json(tempUser);
    } else {
      let obj = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        loginType: req.body.loginType,
      };
      await user.create(obj);
      let tempUser = await user.find({email:email});
      res.status(201).send({ status: "OK", data: tempUser });
    }
  } else {
    res.json({ status: 404, message: "User Not Found!" });
    res.end();
  }
});

router.post("/verifyToken", async (req, res) => {
  const token = await req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  try {
    const decoded = await jwt.verify(token, environment.JWT_SECRETE_KEY);
    return res.status(200).json({ success: true, message: "Token is valid" });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
});

async function chechDuplicateUser(email, mobile) {
  let res = await user.find({ $or: [{ mobile: mobile }, { email: email }] });
  if (res.length >= 1) {
    return true;
  } else {
    return false;
  }
}

function checkProperties(obj) {
  for (var key in obj) {
    if (!obj[key]) {
      return false;
    }
  }
  return true;
}

function isUserAthenticated() {}

module.exports = router;
