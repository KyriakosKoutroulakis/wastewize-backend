const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const { registerUser, loginUser, updateUsersData, deleteUserAccount } = require('../controllers/userController')

/** 
 *  @route  /api/users
*/ 
router.post('/create-account', registerUser)
router.post('/login', loginUser)
router.put('/update-account', authenticateUser, updateUsersData)
router.delete('/delete-account', authenticateUser, deleteUserAccount)

module.exports = router