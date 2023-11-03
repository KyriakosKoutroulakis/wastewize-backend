const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
 
const authenticateUser = asyncHandler (async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err && err.name === 'TokenExpiredError') {
          // todo check the refresh token and generate a new access token
        } else if (err) {
          res.status(401)
          throw new Error('Please login first!')
        }
        return decoded
      })

      const user = await User.findById(decoded._id)

      req.user = user

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Please login first.')
    }
  }
})

// todo Create private func to check the refresh token

module.exports = authenticateUser