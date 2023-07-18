const express = require('express')
const router = express.Router()

const TaskController = require('../controllers/TaskController')

router.get('/add', TaskController.createTask)
router.post('/add', TaskController.createTaskSave)

router.get('/', TaskController.showTasks)

router.get('/edit/:id', TaskController.editTask)
router.post('/update', TaskController.updateTask)
router.post('/togglestatus', TaskController.toggleTaskStatus)

router.post('/delete', TaskController.deleteTask)

module.exports = router