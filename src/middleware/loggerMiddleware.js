/**
 * TODO
 * @desc    Create a logger middleware for all the incoming api requests
 * @package winston 
*/

module.exports = {
  /**
   * @desc   Custom middleware to create logs for all the api calls 
   * @public
  */
  logsHandler (req, res, next) {
    console.log(`${req.method} --- ${req.url} --- ${new Date()}`)
    next()
  }
}