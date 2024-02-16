const mongoose = require('mongoose')

const specialPickupSchema = new mongoose.Schema(
  {
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide store id!']
    },
    storeName: {
      type: String,
      required: [true, 'Please provide a store name for the special pickup service.']
    },
    storeContactPhone: {
      type: String,
      required: [true, 'Please provide a valid phone number!']
    },
    storeEmail: {
      type: String
    },
    selectedDate: {
      type: String,
      required: [true, 'Please provide a device to be picked!']
    },
    pickupDevice: {
      type: String,
      required: [true, 'Please provide a device to be picked!']
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide store id!']
    },
    status: {
      type: String
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

/**
 *  @desc   Retrieve a special pickup booking from the database
 *  @param  {string} id   - users id from the db
 *  @public
 */
specialPickupSchema.statics.findSpecialPickup = async (id) => {
  const specialPickup = await SpecialPickup.findOne({ _id: id })

  if (!specialPickup) {
    res.status(403)
    throw new Error('Special pickup does not exist in database!')
  }

  return specialPickup
}

const SpecialPickup = mongoose.model('SpecialPickup', specialPickupSchema)
module.exports = SpecialPickup
