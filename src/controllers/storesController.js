const asyncHandler = require('express-async-handler')

const Store = require('../models/storeModel')

/**
 *  @desc   Retrieve all stores available from db
 *  @route  GET  api/stores
 *  @public
 *  @protected
 */
const fetchAllStores = asyncHandler(async (req, res) => {
  try {
    const stores = await Store.find()

    res.status(200).send({
      successMessage: 'All stores!',
      stores,
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

module.exports = { fetchAllStores }
