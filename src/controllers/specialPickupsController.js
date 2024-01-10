const asyncHandler = require('express-async-handler')

const SpecialPickup = require('../models/specialPickupModel')
const Store = require('../models/storeModel')

/**
 *  @desc   Make a new  special pickup request from a store
 *  @route  POST  api/special-pickups
 *  @public
 *  @protected
 */
const specialPickupBooking = asyncHandler(async (req, res) => {
  const { storeID, contactPhone, pickupDevice } = req.body

  try {
    const { storeName, homePickupService } = await Store.findStoreById(storeID)

    if (!homePickupService) {
      res.status(200).send({
        successMessage: 'Current store does not provide pickup services!'
      })
    }

    if (!contactPhone || !pickupDevice) {
      throw new Error(
        'Please provide all the information required to make a special pickup booking!'
      )
    }

    const newSpecialPickupBooking = new SpecialPickup({
      storeName,
      storeID,
      userFullName: `${req.user.firstName} ${req.user.lastName}`,
      userID: req.user._id,
      contactPhone,
      pickupDevice
    })

    await newSpecialPickupBooking.save()

    res.status(200).send({
      successMessage: 'Special pickup booking made successfully!',
      newSpecialPickupBooking
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Fetch all pickup requests from a user
 *  @route  GET  api/special-pickups/user-pickups
 *  @public
 *  @protected
 */
const fetchUsersPickupRequests = asyncHandler(async (req, res) => {
  res.status(200).send({
    successMessage: 'All users pickup requests fetched!'
  })
})

module.exports = { specialPickupBooking, fetchUsersPickupRequests }
