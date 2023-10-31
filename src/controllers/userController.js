const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const User = require('../models/userModel')

/**
 *  @desc   Register a new user in database
 *  @route  POST  api/users/create-account
 *  @public
*/ 
const registerUser = async (req, res) => {
  const user = new User(req.body) 

  try {
    await user.save()
    await user.generateAuthToken()

    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
}

/**
 *  @desc   Update users data (email and password are eligible to change)
 *  @route  POST  api/users/update-account
 *  @public
*/ 
const updateUsersData = asyncHandler (async (req, res) => {
  const { email, password, newEmail, newPassword } = req.body

  try {
    const user = await User.findByCredentials(email, password)

    if (newEmail) {
      if (user.email === newEmail) {
        throw new Error('New email address must be different from the old one!')
      }
      user.email = newEmail
    }

    if (newPassword) {
      if (await bcrypt.compare(newPassword, user.password)) {
        throw new Error('Old password and new password cannot be the same!')
      }
      user.password = newPassword
    }
    
    await user.save()
    
    res.status(200).send(user)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

module.exports = { registerUser, updateUsersData }