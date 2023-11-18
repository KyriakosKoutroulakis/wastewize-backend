const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema(
  {
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
  }
)

const Store = mongoose.model('Store', storeSchema)
module.exports = Store