const Task = require('../models/Task')

module.exports = class TaskController {
    static createTask(req, res) {
        res.render('tasks/create')
    }

    static async createTaskSave(req, res) {
        const task = {
            title: req.body.title,
            description: req.body.description,
            done: false
        }

        await Task.create(task)

        res.redirect('/tasks')
    }

    static async showTasks(req, res) {
        const tasks = await Task.findAll({ raw: true })

        res.render('tasks/all', { tasks })
    }

    static async editTask(req, res) {
        const id = req.params.id
        const task = await Task.findOne({ where: { id: id }, raw: true })

        res.render('tasks/edit', { task })
    }

    static async updateTask(req, res) {
        const taskData = {
            title: req.body.title,
            description: req.body.description
        }

        await Task.update(taskData, { where: { id: req.body.id } })
        res.redirect('/tasks')
    }

    static async toggleTaskStatus(req, res) {
        const taskData = {
            done: req.body.done === '0' ? '1' : '0'
        }

        await Task.update(taskData, { where: { id: req.body.id } })
        res.redirect('/tasks')
    }

    static async deleteTask(req, res) {
        const id = req.body.id
        await Task.destroy({ where: { id: id } })

        res.redirect('/tasks')
    }
}