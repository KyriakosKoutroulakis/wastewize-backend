const express = require('express')
const apiRoutes = express.Router()

/**
 * @desc  apiRoutes includes all the routes of the app in a single file and exports them to the server.js
 * @route /api
 */
apiRoutes.use('/user', require('./userRoutes'))
apiRoutes.use('/auth', require('./authRoutes'))
apiRoutes.use('/stores', require('./storeRoutes'))
apiRoutes.use('/special-pickups', require('./specialPickupsRoutes'))

module.exports = apiRoutes
