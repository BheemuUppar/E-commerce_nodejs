const express = require("express");
const router = express.Router();
const { json } = require("body-parser");
const auth = require("../controllers/auth");

router.post("/register", async (req, res) => {
  let obj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    role: req.body.role,
    loginType: req.body.loginType,
  };
  auth.register(req, res, obj);
});

router.post("/login", async (req, res) => {
  const { email, password, loginType } = req.body;
  if (!(email && loginType)) {
    res.status(402).json({ message: "Payload Not Valid" });
    res.end();
    return;
  }
  else {
    auth.login(req, res);
  }
});

router.post("/verifyToken", async (req, res) => {
  const token = await req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }else {
    auth.verifyToken(req, res ,token)
  }
 
});


module.exports = router;
