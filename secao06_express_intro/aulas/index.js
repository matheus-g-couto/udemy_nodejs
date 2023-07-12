const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const users = require('./users')

// Middleware
// const checkAuth = (req, res, next) => {
//     req.authStatus = true

//     if (req.authStatus) {
//         console.log("Está logado, pode continuar")
//         next()
//     } else {
//         console.log("Não está logado, faça login para continuar")
//         next()
//     }
// }
// app.use(checkAuth)

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.static('public'))

app.use('/users', users)

const basePath = path.join(__dirname, 'templates')

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.use((req, res, next) => {
    res.status(404).sendFile(`${basePath}/404.html`)
})

app.listen(port, () => {
    console.log(`App executando na porta ${port}`)
})