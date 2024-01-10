const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
  storeName: { type: String },
  telephoneNumber: { type: String },
  address: {
    streetName: { type: String },
    streetNumber: { type: String },
    city: { type: String },
    postalCode: { type: String }
  },
  coordinates: {
    latitude: { type: String },
    longitude: { type: String }
  },
  workingHours: [{ type: String }],
  acceptedRecycling: [{ type: String }],
  homePickupService: { type: Boolean },
  pickupService: {
    pickupFee: { type: String },
    pickupHours: {
      weekdays: { type: String },
      weekend: { type: String }
    }
  }
})

/**
 *  @desc   Retrieve single store based on the unique _id
 *  @param  {string} id   - stores id from the db
 *  @public
 */
storeSchema.statics.findStoreById = async (id) => {
  const store = await Store.findById(id)

  if (!store) {
    throw new Error('User does not exist.')
  }

  return store
}

const Store = mongoose.model('Store', storeSchema)
module.exports = Store
