const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

const port = 3000

const conn = require('./db/conn')

const Task = require('./models/Task')
const taskRoutes = require('./routes/taskRoutes')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.static('public'))

app.use('/tasks', taskRoutes)

conn.sync().then(() => {
    app.listen(port, () => {
        console.log(`App executando na porta ${port}`)
    })
}).catch(err => {
    console.log(err)
})