const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

function validateUserCredentials(name, email, phone, res) {
    if (!name) {
        res.status(422).json({ message: "O nome é obrigatório!" })
        return false
    }
    if (!email) {
        res.status(422).json({ message: "O e-mail é obrigatório!" })
        return false
    }
    if (!phone) {
        res.status(422).json({ message: "O telefone é obrigatório!" })
        return false
    }

    return true
}

function validateUserPassword(password, confirmpassword, res) {
    if (!password) {
        res.status(422).json({ message: "A senha é obrigatória!" })
        return false
    }

    if (!confirmpassword) {
        res.status(422).json({ message: "A confirmação de senha é obrigatória!" })
        return false
    }

    if (password !== confirmpassword) {
        res.status(422).json({ message: "A senha e a confirmação devem ser idênticas!" })
        return false
    }
    return true
}

async function validateUserRegister(name, email, phone, password, confirmpassword, res) {
    // valida informações de cadastro
    const isUserValid = validateUserCredentials(name, email, phone, res) && validateUserPassword(password, confirmpassword, res)
    if (!isUserValid) return false

    // valida se o usuário ainda não existe no banco de dados
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        res.status(422).json({ message: "Esse e-mail já foi cadastrado" })
        return false
    }
    return true
}

async function validateUserLogin(email, password, res) {
    // valida credenciais de login
    if (!email) {
        res.status(422).json({ message: "O e-mail é obrigatório!" })
        return false
    }
    if (!password) {
        res.status(422).json({ message: "A senha é obrigatória!" })
        return false
    }

    // verifica se o usuário existe
    const user = await User.findOne({ email: email })

    if (!user) {
        res.status(422).json({ message: "Usuário não encontrado!" })
        return false
    }

    // verifica se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        res.status(422).json({ message: "Senha inválida!" })
        return false
    }

    return true
}

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        const canCreateUser = await validateUserRegister(name, email, phone, password, confirmpassword, res)
        if (!canCreateUser) return

        // encrypt password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        const canLogIn = await validateUserLogin(email, password, res)
        if (!canLogIn) return

        const user = await User.findOne({ email: email })
        try {
            await createUserToken(user, req, res)
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decodedToken = jwt.verify(token, "mytokensecret7")

            currentUser = await User.findById(decodedToken.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        const user = await getUserByToken(getToken(req))
        if (!user) {
            res.status(422).json({ message: "Usuário não encontrado!" })
            return
        }

        if (req.file) {
            user.image = req.file.filename
        }

        const userExists = await User.findOne({ email: email })
        if (user.email !== email && userExists) {
            res.status(422).json({ message: "E-mail já utilizado por outro usuário!" })
            return
        }

        const isUserValid = validateUserCredentials(name, email, phone, password, confirmpassword, res)
        if (!isUserValid) return

        user.name = name
        user.email = email
        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({ message: "A senha e a confirmação devem ser idênticas!" })
            return
        } else if (password === confirmpassword && password != null) {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }

        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true })

            res.status(200).json({ message: "Usuário atualizado com sucesso!", updatedUser })
        } catch (err) {
            res.status(500).json({ message: err })
            return
        }
    }
}