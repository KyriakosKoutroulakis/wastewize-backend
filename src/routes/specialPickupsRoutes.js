const express = require('express')
const specialPickupsRoutes = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const { specialPickupBooking, fetchUsersPickupRequests } = require('../controllers/specialPickupsController')

/**
 *  @route  /api/special-pickups
 */
specialPickupsRoutes.post('/', authenticateUser, specialPickupBooking)
specialPickupsRoutes.get('/user-pickups', authenticateUser, fetchUsersPickupRequests)

module.exports = specialPickupsRoutes
