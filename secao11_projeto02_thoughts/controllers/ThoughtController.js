const Thought = require('../models/Thought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ThoughtController {
    static async showAllThoughts(req, res) {
        let search = ''
        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'
        if (req.query.order === 'old') {
            order = 'ASC'
        }

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]]
        })
        const thoughts = thoughtsData.map(result => result.get({ plain: true }))

        let thoughtsQtd = thoughts.length
        if (thoughtsQtd === 0) thoughtsQtd = false

        res.render('thoughts/home', { thoughts, search, thoughtsQtd })
    }

    static async dashboard(req, res) {
        const user = await User.findOne({
            where: { id: req.session.userid },
            include: Thought,
            plain: true
        })

        if (!user) {
            res.redirect('/login')
        }

        const thoughts = user.Thoughts.map(result => result.dataValues)

        let emptyThoughts = false
        if (thoughts.length === 0) emptyThoughts = true

        res.render('thoughts/dashboard', { thoughts, emptyThoughts })
    }

    static createThought(req, res) {
        res.render('thoughts/create')
    }

    static async createThoughtPost(req, res) {
        const thought = { title: req.body.title, UserId: req.session.userid }

        try {
            await Thought.create(thought)

            req.flash('message', "Pensamento criado com sucesso!")

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (err) {
            req.flash('error', "Ocorreu algum erro")
            console.log(err)
            res.redirect('/thoughts/dashboard')
        }
    }

    static async editThought(req, res) {
        const id = req.params.id

        const thought = await Thought.findOne({ where: { id: id }, raw: true })
        res.render('thoughts/edit', { thought })
    }

    static async updateThought(req, res) {
        const id = req.body.id
        const updatedThought = { title: req.body.title }

        try {
            await Thought.update(updatedThought, { where: { id: id, UserId: req.session.userid } })

            req.flash('message', "Pensamento atualizado com sucesso!")

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (err) {
            req.flash('error', "Ocorreu algum erro")
            console.log(err)
            res.redirect('/thoughts/dashboard')
        }
    }

    static async deleteThought(req, res) {
        try {
            await Thought.destroy({ where: { id: req.body.id, UserId: req.session.userid } })

            req.flash('message', "Pensamento removido com sucesso!")

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })

        } catch (err) {
            req.flash('error', "Ocorreu algum erro")
            console.log(err)
            res.redirect('/thoughts/dashboard')
        }
    }
}