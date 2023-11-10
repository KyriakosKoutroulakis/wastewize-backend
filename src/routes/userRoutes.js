const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const { 
  registerUser, 
  loginUser, 
  logoutUser,
  updateUsersData, 
  deleteUserAccount 
} = require('../controllers/userController')

/** 
 *  @route  /api/users
*/ 
router.post('/create-account', registerUser)
router.post('/login', loginUser)
router.post('/logout', authenticateUser, logoutUser)
router.put('/update-account', authenticateUser, updateUsersData)
router.delete('/delete-account', authenticateUser, deleteUserAccount)

module.exports = router
