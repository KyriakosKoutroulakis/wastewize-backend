const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

const authenticateUser = asyncHandler (async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1]

      // todo Implementation of access & refresh tokens for user exp and optimal security
      // todo Code clean
      const decoded = jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        console.log("🚀 ~ file: authMiddleware.js:14 ~ decoded ~ err:", err)
        
      })

      if (!decoded) {
        res.status(401)
        throw new Error('You\'re not authorized.')
      }

      const user = await User.findById(decoded._id)

      if (Date.now() >= decoded.iat * 1000) {
        const newToken = user.generateAuthToken()
        console.log("🚀 ~ file: authMiddleware.js:19 ~ authenticateUser ~ newToken:", newToken)
      }

      req.user = user

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Please authenticate first.')
    }
  }
})

module.exports = authenticateUser