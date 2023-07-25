const jwt = require('jsonwebtoken')

const User = require('../models/User')

const getUserByToken = async (token) => {
    if (!token) {
        return res.status(401).json({ message: "Acesso negado!" })
    }

    const decodedToken = jwt.verify(token, "mytokensecret7")

    const user = await User.findOne({ _id: decodedToken.id })
    return user
}

module.exports = getUserByToken