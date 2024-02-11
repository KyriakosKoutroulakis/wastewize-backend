const express = require('express')
const authRoutes = express.Router()

const { verifyRefreshToken } = require('../controllers/refreshTokenController')

/**
 *  @route  /api/auth
 */
authRoutes.post('/refreshtoken', verifyRefreshToken)

module.exports = authRoutes
