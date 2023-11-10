const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const RefreshToken = require('../models/refreshTokensModel')
const User = require('../models/userModel')

/**
 *  @desc   Check the refresh token from the body and create a new access token
 *  @route  POST  /api/auth/verify-token
 *  @public
*/ 
const verifyRefreshToken = asyncHandler (async (req, res) => {
  const { refreshToken: requestToken } = req.body

  if (!requestToken) {
    res.status(403)
    throw new Error('Refresh token is missing!')
  }

  try {
    const { _id, rToken, owner } = await RefreshToken.retrieveRefreshToken(requestToken)

    jwt.verify(rToken, process.env.JWT_REFRESH_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        RefreshToken.destroyRefreshToken(decoded._id)

        res.status(403)
        throw new Error(err.name)
      }
    })

    // Find user and update the expired access token
    const user = await User.findUserById(owner)
    await user.createAccessToken()
    await user.save()

    const newRefreshToken = await createRefreshToken(_id)

    res.status(201).send({
      refreshToken: newRefreshToken,
      accessToken: user.accessToken
    })
  } catch (error) {
    res.status(403)
    throw new Error(error)
  }
})

const createRefreshToken = asyncHandler (async (owner) => {
  const refreshToken = new RefreshToken()

  try {
    await refreshToken.createRefreshToken(owner)
    await refreshToken.save()
    
    return refreshToken.rToken
  } catch (error) {
    throw new Error(error)
  }
})

const removeRefreshToken = asyncHandler (async (owner) => {
  const refreshToken = new RefreshToken()

  try {
    refreshToken.destroyRefreshToken(owner)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { verifyRefreshToken, createRefreshToken, removeRefreshToken }
