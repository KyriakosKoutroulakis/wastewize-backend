const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

/**
 * @desc    Authenticates user based on the Bearer token provided in the request headers
 * @public 
*/ 
const authenticateUser = asyncHandler (async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1]

      const { _id } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
          res.status(401)
          throw new Error(err.name)
        }
        return decoded
      })

      const user = await User.findById(_id)

      req.user = user

      next()
    } catch (error) {
      res.status(401)
      throw new Error(error)
    }
  } else {
    res.status(403)
    throw new Error('Not authorized! Please login.')
  }
})

module.exports = { authenticateUser }
