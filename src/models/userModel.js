const mongoose = require('mongoose')
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
          throw new Error('Password must contain at leasr 6 alphanumeric values!')
        }
      }
    },
    token: {
      type: String
    }
  },
  {
    timestamps: true,
  }
)

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

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: 60 }) // '10m'

  user.token = token
  await user.save()

  return token
}

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
 *  @desc   Method to check users credentials for authentication
 *  @param  {string} email      - the email address that is being used
 *  @param  {string} password   - users password
 *  @public
 */
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Email does not exist.')
  }

  if (!await bcrypt.compare(password, user.password)) {
    throw new Error('Wrong password provided.')
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User