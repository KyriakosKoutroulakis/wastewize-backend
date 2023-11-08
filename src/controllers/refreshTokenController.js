const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const RefreshToken = require('../models/refreshTokensModel')

/**
 *  @desc   Check the refresh tolen from the body and create a new access token
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
    const rToken = await RefreshToken.retrieveRefreshToken(requestToken)

    if (verifyExpiration(rToken)) {
      const { _id } = jwt.decode(rToken, process.env.JWT_REFRESH_TOKEN_SECRET)

      RefreshToken.destroyRefreshToken(_id)

      res.status(403)
      throw new Error('Refresh token is expired!')
    }
    
    // todo Create another access token and return them both

  } catch (error) {
    res.status(500).send(error)
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

/**
 * @param   {string} token - The refresh token from the request
 * @returns {boolean}      - True or False depending if the token has expired
 * @private
*/
const verifyExpiration = (token) => {
  const { exp } = jwt.decode(token, process.env.JWT_REFRESH_TOKEN_SECRET)

  return Date.now() >= exp * 1000
}

module.exports = { verifyRefreshToken, createRefreshToken, removeRefreshToken }