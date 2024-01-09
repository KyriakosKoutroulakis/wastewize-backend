const express = require('express')
const specialPickupsRoutes = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const {
  specialPickupBooking
} = require('../controllers/specialPickupsController')

/**
 *  @route  /api/special-pickups
 */
specialPickupsRoutes.post('/', authenticateUser, specialPickupBooking)

module.exports = specialPickupsRoutes
