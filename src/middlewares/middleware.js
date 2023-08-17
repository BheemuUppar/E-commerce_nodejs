const environment = require('../../config/environment');
const jwt = require("jsonwebtoken");
module.exports =   authMiddleware = async (req, res, next) => {
    const token = await req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }
    try {
    
      const decoded = await jwt.verify(token, environment.JWT_SECRETE_KEY);
      req.userId = decoded.userId; 
      next(); // if everything is okay it will proceed to next
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired' });
    } else {
        return res.status(401).json({ message: 'Invalid token' });
    }
    }
  };

  module.export = authMiddleware;