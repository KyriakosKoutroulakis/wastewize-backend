const jwt = require('jsonwebtoken')

module.exports = {
  /**
   *  @param   {string}  userId  
   *  @returns {string}  The newAccessToken generated
   *  @public
  */
  generateAccessToken (userId) {
    return jwt.sign({ _id: userId }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP })
  },

  /**
   *  @param   {string}  userId 
   *  @returns {string}  The refresh token generated
   *  @public
  */
  generateRefreshToken (userId) {
    return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXP })
  }
}
