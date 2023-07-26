const router = require('express').Router()

const PetController = require('../controllers/PetController')

// middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)

router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getUserPets)
router.get('/myadoptions', verifyToken, PetController.getUserAdoptions)

router.get('/:id', PetController.getPetById)

router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

router.delete('/:id', verifyToken, PetController.deletePetById)

module.exports = router