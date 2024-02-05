const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const RefreshToken = require('../models/refreshTokenModel')
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
    jwt.verify(requestToken, process.env.JWT_REFRESH_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        if (!(err.message === 'invalid signature')) {
          const r = jwt.decode(requestToken, process.env.JWT_REFRESH_TOKEN_SECRET)
          RefreshToken.destroyRefreshToken(r._id)
        }
        res.status(403)
        throw new Error('NoValidRefreshToken')
      }
    })

    const token = await RefreshToken.retrieveRefreshToken(requestToken, 'token')
    await token.createRefreshToken(token.owner)
    await token.save()

    // Find user and update the expired access token
    const user = await User.findUserById(token.owner)
    await user.createAccessToken()
    await user.save()

    res.status(201).send({
      refreshToken: token.rToken,
      accessToken: user.accessToken
    })
  } catch (error) {
    res.status(403)
    throw new Error(error)
  }
})

/**
 *  @desc   Create a new refresh token after user's actions - register, login, refresh accessToken
 *  @param  {owner} - The users unique id
 *  @public
*/ 
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

/**
 *  @desc   Delete user's refresh token in db after actions - logout, invalid refreshToken check
 *  @param  {owner} - The users unique id
 *  @public
*/ 
const removeRefreshToken = asyncHandler (async (owner) => {
  try {
    RefreshToken.destroyRefreshToken(owner)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { verifyRefreshToken, createRefreshToken, removeRefreshToken }
