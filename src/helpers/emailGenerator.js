const Mailgen = require('mailgen')

const mailGenerator = new Mailgen({
  theme: 'salted',
  product: {
    name: 'WasteWizeApp',
    link: 'https://mailgen.js/',
    logo: 'https://mailgen.js/img/logo.png',
    copyright: 'Copyright © 2024 WasteWizeApp. All rights reserved.'
  }
})

const generateWelcomeEmail = (name) => {
  let email = {
    body: {
      title: `Hello ${name}`,
      intro: "Welcome to WasteWize, your personal waste management app! We're very excited to have you on board."
    }
  }

  let emailBody = mailGenerator.generate(email)

  return emailBody
}

const generateFarewellEmail = (name) => {
  let email = {
    body: {
      title: `Hi ${name}`,
      intro: 'We are so sorry to hear that you want to terminate your account! This action can not be undone, so be careful!',
      action: {
        instructions: 'Click the button to verify the deletion of the account!',
        button: {
          color: '#22BC66',
          text: 'Confirm delettion',
          link: '#'
        }
      },
      outro: "We'd love to see you again soon <3"
    }
  }

  let emailBody = mailGenerator.generate(email)

  return emailBody
}

module.exports = { generateWelcomeEmail, generateFarewellEmail }
