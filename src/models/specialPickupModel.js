const mongoose = require('mongoose')

const specialPickupSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'Please provide a store name for the special pickup service.']
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide store id!']
    },
    userFullName: {
      type: String,
      required: [true, 'Please provide users full name!']
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide store id!']
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide a valid phone number!']
    },
    pickupDevice: {
      type: String,
      required: [true, 'Please provide a device to be picked!']
    }
  },
  {
    timestamps: true
  }
)

// Relationship between  SpecialPickup - Stores
specialPickupSchema.virtual('stores', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'storeID'
})

// Relationship between SpecialPickup - User
specialPickupSchema.virtual('user', {
  ref: 'User',
  localField: '_id',
  foreignField: 'userID'
})

/**
 *  @desc   Retrieve all special pickup bookings for a specific user
 *  @param  {string} id   - users id from the db
 *  @public
 */
specialPickupSchema.statics.findAllSpecialPickupBookings = async (id) => {
  const specialPickups = await SpecialPickup.find({ userID: id })

  return specialPickups.length ? specialPickups : []
}

const SpecialPickup = mongoose.model('SpecialPickup', specialPickupSchema)
module.exports = SpecialPickup
