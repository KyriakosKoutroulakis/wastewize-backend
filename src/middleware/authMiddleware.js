const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

const authenticateUser = asyncHandler (async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded._id)

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Please authenticate first.')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Please authenticate first.')
  }
})

module.exports = authenticateUser