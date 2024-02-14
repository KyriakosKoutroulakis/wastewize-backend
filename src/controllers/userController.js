const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const { createRefreshToken, removeRefreshToken } = require('./refreshTokenController')
const { makeAppropriateGreetToUser } = require('./emailsController')

const User = require('../models/userModel')
const RefreshToken = require('../models/refreshTokenModel')

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

    // Handle if user is already logged in
    if (user.accessToken.length > 0) {
      const { rToken } = await RefreshToken.retrieveRefreshToken(user._id, 'user')

      res.status(200).send({
        successMessage: 'user_already_logged_in',
        user,
        refreshToken: rToken
      })
    } else {
      await user.createAccessToken()
      await user.save()

      const refreshToken = await createRefreshToken(user._id)

      res.status(200).send({
        successMessage: 'Login successfull!',
        user,
        refreshToken
      })
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 *  @desc   Update users data
 *  @route  POST  api/user/update-account
 *  @public
 *  @protected
 */
const updateUsersProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, newEmail, newPassword, oldPassword } = req.body

  try {
    const user = await User.findUserByCredentials(req.user.email, oldPassword || '')

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

    user.firstName = firstName.length > 0 ? firstName : user.firstName
    user.lastName = lastName.length > 0 ? lastName : user.lastName

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
 *  @desc   Update users recieveEmail status
 *  @route  POST  api/user/email-settings
 *  @public
 *  @protected
 */
const updateUsersEmailSettings = asyncHandler(async (req, res) => {
  const { recieveEmail } = req.body

  try {
    req.user.recieveEmails = recieveEmail

    await req.user.save()

    res.status(200).send({
      successMessage: 'You have successfully updated your email settings!',
      user: req.user
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

module.exports = { registerUser, loginUser, updateUsersProfile, updateUsersEmailSettings, deleteUserAccount, logoutUser }
