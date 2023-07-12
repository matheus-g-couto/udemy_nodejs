const express = require('express')
const path = require('path')

const app = express()
const port = 5000

const basePath = path.join(__dirname, '/templates')

const profile = require('./profile')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.static('public'))

app.use('/profile', profile)

app.get('/home', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.use((req, res, next) => {
    res.status(404).sendFile(`${basePath}/404.html`)
})

app.listen(port, () => {
    console.log(`App executando na porta ${port}`)
})