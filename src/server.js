const express = require('express')
const dotenv = require('dotenv').config()

const { connectDatabse } = require('./configs/database')
const { errorHandler } = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000

connectDatabse()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port: ${port}!`)
})