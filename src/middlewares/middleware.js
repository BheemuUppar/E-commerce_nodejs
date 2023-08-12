const environment = require('../../config/environment');
const jwt = require("jsonwebtoken");
module.exports =   authMiddleware = async (req, res, next) => {
    const token = await req.header('Authorization')?.replace('Bearer ', '');
    // console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }
    try {
      const decoded = await jwt.verify(token, environment.JWT_SECRETE_KEY);
      console.log(decoded)
      req.userId = decoded.userId; 
      next(); // if everything is okay it will proceed to next
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token'});
    }
  };

  module.export = authMiddleware;