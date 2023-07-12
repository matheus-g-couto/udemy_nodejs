const express = require('express')
const router = express.Router()

const path = require('path')

const basePath = path.join(__dirname, '../templates')

router.get('/carl', (req, res) => {
    res.sendFile(`${basePath}/white-boy-carl.html`)
})

router.get('/lip', (req, res) => {
    res.sendFile(`${basePath}/lip.html`)
})

module.exports = router