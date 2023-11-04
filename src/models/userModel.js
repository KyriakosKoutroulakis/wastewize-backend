const mongoose = require('mongoose')
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../helpers/generateAuthTokens')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email'],
      trim: true,
      validate (email) {
        if (!emailValidator.validate(email)) {
          throw new Error('Please provide a valid email address!')
        }
      }
    },
    password: {
      type: String,
      required: [true, 'Please provide a strong password'],
      trim: true,
      validate (password) {
        if (password.length < 7) {
          throw new Error('Password must contain at least 6 alphanumeric values!')
        }
      }
    },
    tokens: {
      accessToken: {
        type: String
      },
      refreshToken: {
        type: String
      }
    }
  },
  {
    timestamps: true,
  }
)

/**
 *  @desc   Hash users password before storing it to database
 *  @private  
*/
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10))
  }

  next()
})

/**
 *  @desc   Remove confidential info before returning the user object
 *  @private  
*/
userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()

  delete userObj.password

  return userObj
}

/**
 *  @desc   Generate users access key for authentication
 *  @public 
*/
userSchema.methods.generateAccessToken = async function () {
  const user = this

  user.tokens.accessToken = generateAccessToken(user._id.toString())

  return user
}

// TODO Create method to generate Refresh token

/**
 *  @desc   Retrieve user based on the credentials provided
 *  @param  {string} email      - the email address that is being used
 *  @param  {string} password   - users password
 *  @public
*/
userSchema.statics.findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Email does not exist.')
  }

  if (!await bcrypt.compare(password, user.password)) {
    throw new Error('Wrong password provided.')
  }

  return user
}

/**
 *  @desc   Retrieve user based on the unique _id
 *  @param  {string} id   - users id from the db
 *  @public
*/
userSchema.statics.findUserById = async (id) => {
  const user = await User.findById(id)

  if (!user) {
    throw new Error('User does not exist.')
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User