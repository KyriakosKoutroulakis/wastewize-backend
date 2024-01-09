const mongoose = require('mongoose')

const specialPickup = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [
        true,
        'Please provide a store name for the special pickup service.'
      ]
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
    }
  },
  {
    timestamps: true
  }
)

const SpecialPickup = mongoose.model('SpecialPickup', specialPickup)
module.exports = SpecialPickup
