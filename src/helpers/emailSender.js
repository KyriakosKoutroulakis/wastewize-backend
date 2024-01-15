const nodemailer = require('nodemailer')
const mailgen = require('mailgen')
const asyncHandler = require('express-async-handler')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'wastewizeapp@gmail.com',
    pass: 'yefgwqnneixjmvxf'
  }
})

let MailGen = new mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js/'
  }
})

let email = {
  body: {
    name: 'Test 1',
    intro: 'Testing email!',
    table: {
      data: [
        {
          item: 'Nodemailer email',
          description: 'A backend application.',
          price: '2$/month'
        }
      ]
    },
    outro: 'Was a pleasure.'
  }
}

let testEmail = MailGen.generate(email)

let emailToBeSent = {
  from: 'wastewizeapp@gmail.com', // sender address
  to: 'wastewize@yopmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  html: testEmail // html body
}

// async..await is not allowed in global scope, must use a wrapper
// async function main() {
// send mail with defined transport object

// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//
// NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//       <https://github.com/forwardemail/preview-email>
//
// }

const welcomeEmailOnRegister = asyncHandler(async () => {
  try {
    const info = await transporter.sendMail(emailToBeSent)
    console.log('Message sent: %s', info)
  } catch (error) {
    // log the error
  }
})

const updateUserAboutAction = asyncHandler(async () => {})

const goodbyeEmailOnDelete = asyncHandler(async () => {})

module.exports = { welcomeEmailOnRegister, updateUserAboutAction, goodbyeEmailOnDelete }
