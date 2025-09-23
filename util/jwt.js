let jwt = require('jsonwebtoken')

module.exports.GenerateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY)
}