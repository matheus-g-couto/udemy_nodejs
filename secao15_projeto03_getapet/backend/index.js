const express = require('express')
const cors = require('cors')

const app = express()

const port = 5000

// configure JSON response
app.use(express.json())

// solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// folder for images
app.use(express.static('public'))

// routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

app.listen(port, () => {
    console.log(`Back-end executando na porta ${port}`)
})