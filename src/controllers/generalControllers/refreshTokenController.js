const asyncHandler = require('express-async-handler')

const RefreshToken = require('../../models/refreshTokensModel')

const createRefreshToken = asyncHandler (async (owner) => {
  const refreshToken = new RefreshToken()

  try {
    await refreshToken.createRefreshToken(owner)
    await refreshToken.save()
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

module.exports = { createRefreshToken, removeRefreshToken }