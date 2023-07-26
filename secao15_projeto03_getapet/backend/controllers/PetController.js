const Pet = require('../models/Pet')

const ObjectId = require('mongoose').Types.ObjectId

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

function validatePetInfo(name, age, weight, color, images, res) {
    if (!name) {
        res.status(422).json({ message: "O nome é obrigatório!" })
        return false
    }
    if (!age) {
        res.status(422).json({ message: "A idade é obrigatória!" })
        return false
    }
    if (!weight) {
        res.status(422).json({ message: "O peso é obrigatório!" })
        return false
    }
    if (!color) {
        res.status(422).json({ message: "A cor é obrigatória!" })
        return false
    }
    if (images.length == 0) {
        res.status(422).json({ message: "Pelo menos uma imagem é obrigatória!" })
        return false
    }

    return true
}

function validatePetId(id, res) {
    if (!ObjectId.isValid(id)) {
        res.status(422).json({ message: "ID inválido!" })
        return false
    }

    return true
}

function petExists(pet, res) {
    if (!pet) {
        res.status(404).json({ message: "Pet não encontrado!" })
        return false
    }

    return true
}

function canManipulatePet(pet, user, res) {
    if (!pet.user._id.equals(user._id)) {
        res.status(422).json({ message: "Você não pode manipular um pet de outro usuário!" })
        return false
    }

    return true
}

module.exports = class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const images = req.files

        const available = true

        // upload de imagens

        // validations
        const isPetValid = validatePetInfo(name, age, weight, color, images, res)
        if (!isPetValid) return

        // get pet owner
        const user = await getUserByToken(getToken(req))

        const pet = new Pet({
            name, age, weight, color, available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map(image => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()

            res.status(201).json({
                message: "Pet cadastrado com sucesso",
                newPet
            })
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({ pets })
    }

    static async getUserPets(req, res) {
        const user = await getUserByToken(getToken(req))

        const userPets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
        res.status(200).json({ userPets })
    }

    static async getUserAdoptions(req, res) {
        const user = await getUserByToken(getToken(req))

        const userPets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')
        res.status(200).json({ userPets })
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if (!validatePetId(id, res)) return

        const pet = await Pet.findById(id)
        if (!petExists(pet, res)) return

        res.status(200).json({ pet })
    }

    static async updatePet(req, res) {
        // validations
        const id = req.params.id
        if (!validatePetId(id, res)) return

        const pet = await Pet.findById(id)
        if (!petExists(pet, res)) return

        const user = await getUserByToken(getToken(req))
        if (!canManipulatePet(pet, user, res)) return

        // update
        const { name, age, weight, color, available } = req.body
        const images = req.files
        const updatedData = {}

        const isPetInfoValid = validatePetInfo(name, age, weight, color, images, res)
        if (!isPetInfoValid) return

        updatedData.name = name
        updatedData.age = age
        updatedData.weight = weight
        updatedData.color = color

        updatedData.images = []
        images.map(image => updatedData.images.push(image.filename))

        if (!available) {
            res.status(422).json({ message: 'O status é obrigatório!' })
            return
        } else {
            updatedData.available = available
        }

        await Pet.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: "Pet atualizado com sucesso!" })
    }

    static async schedule(req, res) {
        // validations
        const id = req.params.id
        if (!validatePetId(id, res)) return

        const pet = await Pet.findById(id)
        if (!petExists(pet, res)) return

        const user = await getUserByToken(getToken(req))
        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: "Você não pode agendar uma visita com seu próprio pet!" })
            return
        }
        if (pet.adopter && pet.adopter._id.equals(user._id)) {
            res.status(422).json({ message: "Você já agendou uma visita para esse pet!" })
            return
        }

        // schedule
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        })
    }

    static async concludeAdoption(req, res) {
        // validations
        const id = req.params.id
        if (!validatePetId(id, res)) return

        const pet = await Pet.findById(id)
        if (!petExists(pet, res)) return

        const user = await getUserByToken(getToken(req))
        if (!canManipulatePet(pet, user, res)) return

        // adoption
        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: "Parabéns, o ciclo de adoção foi finalizado com sucesso!" })
    }

    static async deletePetById(req, res) {
        // validations
        const id = req.params.id
        if (!validatePetId(id, res)) return

        const pet = await Pet.findById(id)
        if (!petExists(pet, res)) return

        const user = await getUserByToken(getToken(req))
        if (!canManipulatePet(pet, user, res)) return

        // delete
        await Pet.findByIdAndRemove(id)
        res.status(200).json({ message: "Pet removido com sucesso!" })
    }
}