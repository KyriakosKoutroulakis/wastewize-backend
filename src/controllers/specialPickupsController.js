const asyncHandler = require('express-async-handler')

const SpecialPickup = require('../models/userModel')

const specialPickupBooking = asyncHandler(async (req, res) => {
  // const { storeName, storeID, userFullName, contactPhone } = req.body

  console.log('🚀 ~ specialPickupBooking ~ req.body:', req.body)
  console.log('🚀 ~ specialPickupBooking ~ req.user:', req.user)

  res.status(200).send({
    successMessage: 'Special pickup booking made successfully!'
  })
})

module.exports = { specialPickupBooking }
