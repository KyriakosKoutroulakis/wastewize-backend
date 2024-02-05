const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const { createRefreshToken, removeRefreshToken } = require('./refreshTokenController')
const { makeAppropriateGreetToUser } = require('./emailsController')

const User = require('../models/userModel')

/**
 *  @desc   Register a new user in database
 *  @route  POST  api/user/create-account
 *  @public
 */
const registerUser = asyncHandler(async (req, res) => {
  const user = new User(req.body)

  try {
    await user.createAccessToken()
    await user.save()

    const refreshToken = await createRefreshToken(user._id)

    makeAppropriateGreetToUser(user.firstName, user.lastName, user.email, 'welcome')

    res.status(201).send({
      successMessage: 'Account created successfully!',
      user,
      refreshToken
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Login user and generate new auth token
 *  @route  POST  api/user/login
 *  @public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findUserByCredentials(email, password)

    if (user.accessToken.length > 0) {
      res.status(200)
      throw new Error('User already logged in!')
    }
  
    await user.createAccessToken()
    await user.save()

    const refreshToken = await createRefreshToken(user._id)

    res.status(200).send({
      successMessage: 'Login successfull!',
      user,
      refreshToken
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Update users data (email and password are eligible to change)
 *  @route  POST  api/user/update-account
 *  @public
 *  @protected
 */
const updateUsersData = asyncHandler(async (req, res) => {
  const { email, password, newEmail, newPassword } = req.body

  try {
    const user = await User.findUserByCredentials(email, password)

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

    res.status(200).send({
      successMessage: 'You have successfully updated your personal info!',
      user
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Logout user
 *  @route  POST  api/user/logout
 *  @public
 *  @protected
 */
const logoutUser = asyncHandler(async (req, res) => {
  try {
    req.user.accessToken = ''

    await req.user.save()

    removeRefreshToken(req.user._id)

    res.status(200).send({
      successMessage: 'User logged out!'
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Delete users account from db
 *  @route  DELETE  api/user/delete-account
 *  @public
 *  @protected
 */
const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    makeAppropriateGreetToUser(req.user.firstName, req.user.lastName, req.user.email, 'delete')

    await req.user.deleteOne()

    removeRefreshToken(req.user._id)

    res.status(200).send({
      successMessage: 'Account deleted!'
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

module.exports = { registerUser, loginUser, updateUsersData, deleteUserAccount, logoutUser }
