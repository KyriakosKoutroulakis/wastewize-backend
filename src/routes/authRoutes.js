const express = require('express')
const authRoutes = express.Router()

const { verifyRefreshToken } = require('../controllers/tokenController')

/** 
 *  @route  /api/auth
*/
authRoutes.post('/verify-token', verifyRefreshToken)

module.exports = authRoutes
