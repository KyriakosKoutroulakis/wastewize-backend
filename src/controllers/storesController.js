const asyncHandler = require('express-async-handler')

// const Store = require('../models/storeModel')

/**
 *  @desc   Fetches all the stores from the db
 *  @route  GET  api/stores
 *  @public
 *  @protected
*/ 
const fetchAllStores= asyncHandler(async (req, res) => {
  res.status(200).send({
    successMessage: 'All stores available!',
    stores: []
  })
})

module.exports = { fetchAllStores }
