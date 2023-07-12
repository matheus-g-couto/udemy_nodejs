const express = require('express')
const router = express.Router()

const path = require('path')

const basePath = path.join(__dirname, '../templates')

router.get('/create', (req, res) => {
    res.sendFile(`${basePath}/user-form.html`)
})

router.post('/save', (req, res) => {
    console.log(req.body)
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(`Buscando o usuário ${id}`)

    res.sendFile(`${basePath}/users.html`)
})

module.exports = router