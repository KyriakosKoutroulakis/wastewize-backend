const mongoose = require('mongoose')

const { generateRefreshToken } = require('../helpers/generateAuthTokens')

const refreshTokenSchema = new mongoose.Schema(
  {
    rToken: {
      type: String
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: [true, 'Please provide owners id!']
    }
  },
  {
    timestamps: true,
  }
)

/**
 *  @desc   Generate users refresh token for authentication
 *  @param  {string} owner - The unique id of the user that creates the rToken
 *  @public 
*/
refreshTokenSchema.methods.createRefreshToken = async function (owner) {
  const refreshToken = this

  refreshToken.rToken = generateRefreshToken(owner.toString())
  refreshToken.owner = owner

  return refreshToken 
}

/**
 *  @desc   Destroy refreshToken from db on user delete
 *  @param  {string} owner - The unique id of the user that creates the rToken
 *  @public 
*/
refreshTokenSchema.methods.destroyRefreshToken = async function (owner) {
  const removal = await RefreshToken.findOneAndDelete({ owner })
 
  return removal
}

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
module.exports = RefreshToken
