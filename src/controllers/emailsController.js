const asyncHandler = require('express-async-handler')

const { emailTransporter } = require('../configs/emailProviderConf')
const { generateWelcomeEmail, generateFarewellEmail, generateSpecialPickupEmail } = require('../helpers/emailGenerator')

const createEmailToBeSent = (userEmail, emailBody) => {
  let emailToBeSent = {
    from: process.env.APP_EMAIL_DOMAIN,
    to: userEmail,
    subject: 'wastewize newsletter',
    html: emailBody
  }
  return emailToBeSent
}

/**
 *  @desc   Send automated email for appropriate greeting to the user
 *  @param  {string} firstName
 *  @param  {string} lastName
 *  @param  {string} email
 *  @param  {string} action - the actuall action passed as a string
 *  @public
 */
const makeAppropriateGreetToUser = asyncHandler(async (firstName, lastName, email, action) => {
  let emailBody

  if (action === 'delete') {
    emailBody = generateFarewellEmail(`${firstName} ${lastName}`)
  } else {
    emailBody = generateWelcomeEmail(`${firstName} ${lastName}`)
  }

  const emailReady = createEmailToBeSent(email, emailBody)

  try {
    await emailTransporter.sendMail(emailReady)
  } catch (error) {
    // TODO log the error for reference
  }
})

/**
 *  @desc   Summarize the special pickup details and send an email to the user
 *  @param  {string} name
 *  @param  {string} email
 *  @param  {string} storeName
 *  @param  {string} storeContactPhone
 *  @param  {string} selectedDate
 *  @param  {string} pickupDevice
 *  @public
 */
const updateUserAboutSpecialPickup = asyncHandler(async (name, email, storeName, storeContactPhone, selectedDate, pickupDevice) => {
  let emailBody = generateSpecialPickupEmail(name, storeName, storeContactPhone, selectedDate, pickupDevice)

  const emailReady = createEmailToBeSent(email, emailBody)

  try {
    await emailTransporter.sendMail(emailReady)
  } catch (error) {
    // TODO log the error for reference
  }
})

module.exports = { makeAppropriateGreetToUser, updateUserAboutSpecialPickup }
