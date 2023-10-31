const mongoose = require('mongoose')

/**
 *  @desc   Connect server to MongoDB Atlas
 *  @access Public
*/ 
module.exports = { 
  connectDatabse: async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`Database connected successfully!`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}