const express = require('express')
const router = express.Router()

const { verifyRefreshToken } = require('../controllers/tokenController')

/** 
 *  @route  /api/auth
*/
router.post('/verify-token', verifyRefreshToken)

module.exports = router
