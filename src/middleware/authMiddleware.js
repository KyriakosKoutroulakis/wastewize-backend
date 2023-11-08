const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const RefreshToken = require('../models/refreshTokensModel')

/**
 * @desc    Authenticates user based on the Bearer token provided in the request headers
 * @public 
*/ 
const authenticateUser = asyncHandler (async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1]

      const { _id } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err && err.name === 'TokenExpiredError') {
          return refreshAccessToken(jwt.decode(token))
        }
        return decoded
      })

      const user = await User.findById(_id)

      req.user = user

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Please login first.')
    }
  }
})

/**
 * @desc    Generate a new access token for the user based on the unique id
 * @private
*/ 
const refreshAccessToken = asyncHandler (async ({ _id }) => {
  try {
    let refreshToken = RefreshToken.retrieveRefreshToken(_id)

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    
    const user = await User.findUserById(_id)
    await user.createAccessToken(user._id)
    await user.save()

    return user
  } catch (error) {
    throw new Error('Please you have to login.')
  }
})

module.exports = { authenticateUser }