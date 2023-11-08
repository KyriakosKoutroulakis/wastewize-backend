const express = require('express')
const router = express.Router()

const { verifyRefreshToken } = require('../controllers/refreshTokenController')

/** 
 *  @route  /api/auth
*/
router.post('/verify-token', verifyRefreshToken)