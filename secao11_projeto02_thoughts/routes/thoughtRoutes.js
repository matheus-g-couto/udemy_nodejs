const express = require('express')
const router = express.Router()

const ThoughtController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, ThoughtController.createThought)
router.post('/add', checkAuth, ThoughtController.createThoughtPost)

router.get('/edit/:id', checkAuth, ThoughtController.editThought)
router.post('/update', checkAuth, ThoughtController.updateThought)

router.post('/delete', checkAuth, ThoughtController.deleteThought)

router.get('/dashboard', checkAuth, ThoughtController.dashboard)
router.get('/', ThoughtController.showAllThoughts)


module.exports = router