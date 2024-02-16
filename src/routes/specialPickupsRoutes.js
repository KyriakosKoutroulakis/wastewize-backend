const express = require('express')
const specialPickupsRoutes = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const {
  specialPickupBooking,
  fetchUsersPickupRequests,
  updateSpecialPickupBooking,
  cancelSpecialPickupBooking
} = require('../controllers/specialPickupsController')

/**
 *  @route  /api/special-pickups
 */
specialPickupsRoutes.post('/', authenticateUser, specialPickupBooking)
specialPickupsRoutes.get('/user-pickups', authenticateUser, fetchUsersPickupRequests)
specialPickupsRoutes.put('/update-pickup', authenticateUser, updateSpecialPickupBooking)
specialPickupsRoutes.delete('/cancel-pickup', authenticateUser, cancelSpecialPickupBooking)

module.exports = specialPickupsRoutes
