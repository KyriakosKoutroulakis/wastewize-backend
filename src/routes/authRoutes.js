const express = require('express')
const authRoutes = express.Router()

const { verifyRefreshToken } = require('../controllers/refreshTokenController')

/** 
 *  @route  /api/auth
*/
authRoutes.post('/verify-token', verifyRefreshToken)

module.exports = authRoutes
