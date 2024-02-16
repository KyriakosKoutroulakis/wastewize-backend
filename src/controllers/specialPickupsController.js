const asyncHandler = require('express-async-handler')

const { updateUserAboutSpecialPickup } = require('./emailsController')

const SpecialPickup = require('../models/specialPickupModel')
const Store = require('../models/storeModel')

/**
 *  @desc   Make a new  special pickup request from a store
 *  @route  POST  api/special-pickups
 *  @public
 *  @protected
 */
const specialPickupBooking = asyncHandler(async (req, res) => {
  const { storeID, pickupDevice, selectedDate } = req.body

  try {
    const { storeName, homePickupService, email, telephoneNumber } = await Store.findStoreById(storeID)

    if (!homePickupService) {
      throw new Error('Current store does not provide pickup services!')
    }

    if (!pickupDevice) {
      throw new Error('Please provide all the information required to make a special pickup booking!')
    }

    const newSpecialPickupBooking = new SpecialPickup({
      storeID,
      storeName,
      storeContactPhone: telephoneNumber,
      storeEmail: email,
      selectedDate,
      userID: req.user._id,
      pickupDevice,
      status: 'pending'
    })

    await newSpecialPickupBooking.save()

    updateUserAboutSpecialPickup(req.user.firstName, req.user.email, storeName, telephoneNumber, selectedDate, pickupDevice)

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
 *  @desc   Update existing special pickup request
 *  @route  PUT  api/special-pickups/update-pickup
 *  @public
 *  @protected
 */
const updateSpecialPickupBooking = asyncHandler(async (req, res) => {
  const { pickupID, pickupDevice, selectedDate } = req.body

  try {
    let specialPickup = await SpecialPickup.findSpecialPickup(pickupID)

    specialPickup.pickupDevice = pickupDevice ? pickupDevice : specialPickup.pickupDevice
    specialPickup.selectedDate = selectedDate ? selectedDate : specialPickup.selectedDate

    await specialPickup.save()

    // TODO: Send email to user about the update
    updateUserAboutSpecialPickup(
      req.user.firstName,
      req.user.email,
      specialPickup.storeName,
      specialPickup.storeContactPhone,
      specialPickup.selectedDate,
      specialPickup.pickupDevice
    )

    res.status(200).send({
      successMessage: 'Special pickup request updated successfully!',
      specialPickup
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

/**
 *  @desc   Cancel special pickup after users request
 *  @route  DELETE  api/special-pickups/delete-pickup
 *  @public
 *  @protected
 */
const cancelSpecialPickupBooking = asyncHandler(async (req, res) => {
  const { pickupID } = req.body

  try {
    let specialPickup = await SpecialPickup.findSpecialPickup(pickupID)

    specialPickup.status = 'cancelled'
    specialPickup.save()

    res.status(200).send({
      successMessage: 'Special pickup request cancelled successfully!',
      specialPickup
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

module.exports = { specialPickupBooking, fetchUsersPickupRequests, updateSpecialPickupBooking, cancelSpecialPickupBooking }
