const environment = require("../../config/environment");
const user = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = environment.saltRounds;
const jwt = require("jsonwebtoken");

async function register(req, res, body) {
  if (checkProperties(body)) {
    const isUserExist = await chechDuplicateUser(body.email, body.mobile);
    if (!isUserExist) {
      bcrypt.hash(obj.password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          res.status(500).send("Error hashing password");
        } else {
          body.password = await hashedPassword;
          await user.create(body);
          res.status(201).send({ status: "OK" });
        }
      });
    } else {
      res.status(409).json({ message: "User already registered" });
    }
  } else {
    res.send("Properties Required!");
  }
}

async function login(req, res) {
  const { email, password, loginType } = req.body;
  const dbUser = await user.find({ email: email });
  console.log(dbUser)
  if (dbUser && dbUser.length > 0 && loginType == "password") {
    handlePasswordLogin(req, res , password, dbUser);
  } else if (email && loginType == "gmail") {
    handleGmailLogin(req, res, email);
  } else {
    res.json({ status: 404, message: "User Not Found!" });
    res.end();
  }
}

async function verifyToken(req , res, token){
  
    try {
        const decoded = await jwt.verify(token, environment.JWT_SECRETE_KEY);
         res.status(200).json({ success: true, message: "Token is valid" });
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
           res
            .status(401)
            .json({ success: false, message: "Token has expired" });
        } else {
           res.status(401).json({ success: false, message: "Invalid token" });
        }
      }
}

function handlePasswordLogin(req, res, password, dbUser) {
  bcrypt.compare(password, dbUser[0].password, async (err, result) => {
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

async function handleGmailLogin(req, res, email) {
  let tempUser = await user.find({ email: email });
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
    let tempUser = await user.find({ email: email });
    res.status(201).send({ status: "OK", data: tempUser });
  }
}

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

module.exports = { register, login, verifyToken };
