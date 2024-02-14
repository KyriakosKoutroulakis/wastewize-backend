const express = require('express')
const userRoutes = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const {
  registerUser,
  loginUser,
  logoutUser,
  updateUsersProfile,
  updateUsersEmailSettings,
  deleteUserAccount
} = require('../controllers/userController')

/**
 *  @route  /api/user
 */
userRoutes.post('/create-account', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.post('/logout', authenticateUser, logoutUser)
userRoutes.put('/update-account', authenticateUser, updateUsersProfile)
userRoutes.put('/email-settings', authenticateUser, updateUsersEmailSettings)
userRoutes.delete('/delete-account', authenticateUser, deleteUserAccount)

module.exports = userRoutes
