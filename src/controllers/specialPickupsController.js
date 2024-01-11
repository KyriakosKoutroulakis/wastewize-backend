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
      throw new Error('Current store does not provide pickup services!')
    }

    if (!contactPhone || !pickupDevice) {
      throw new Error('Please provide all the information required to make a special pickup booking!')
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

    res.status(201).send({
      successMessage: 'Special pickup booking made successfully!',
      newSpecialPickupBooking
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Fetch all pickup requests for a specific user
 *  @route  GET  api/special-pickups/user-pickups
 *  @public
 *  @protected
 */
const fetchUsersPickupRequests = asyncHandler(async (req, res) => {
  try {
    const specialPickups = await SpecialPickup.findAllSpecialPickupBookings(req.user._id)

    let message = specialPickups.length > 0 ? 'All users special pickup requests!' : 'Users does not have any special pickup requests!'

    res.status(200).send({
      successMessage: message,
      specialPickups
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

module.exports = { specialPickupBooking, fetchUsersPickupRequests }
