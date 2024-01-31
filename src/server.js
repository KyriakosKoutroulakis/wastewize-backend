const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const { connectDatabse } = require('./configs/mongodbConf')
const { logsHandler } = require('./middleware/loggerMiddleware')
const { errorHandler } = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000

connectDatabse()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(logsHandler)
app.use('/api', require('./routes/index'))
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port: ${port}!`)
})
