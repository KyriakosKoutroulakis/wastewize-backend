const nodemailer = require('nodemailer')

/**
 *  @desc   Credentials for automatic emails
 *  @access Public
 */
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.APP_EMAIL_DOMAIN,
    pass: process.env.APP_EMAIL_PASSWORD
  }
})

module.exports = { emailTransporter }
