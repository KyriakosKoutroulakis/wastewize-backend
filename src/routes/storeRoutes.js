const express = require('express')
const storeRoutes = express.Router()

const { authenticateUser } = require('../middleware/authMiddleware')

const { fetchAllStores } = require('../controllers/storesController')

/**
 *  @route  /api/stores
 */
storeRoutes.get('/', authenticateUser, fetchAllStores)

module.exports = storeRoutes
