const asyncHandler = require('express-async-handler')

const { emailTransporter } = require('../configs/emailProviderConf')
const { generateWelcomeEmail, generateFarewellEmail } = require('../helpers/emailGen')

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

const updateUserAboutAction = asyncHandler(async () => {})

module.exports = { makeAppropriateGreetToUser, updateUserAboutAction }
