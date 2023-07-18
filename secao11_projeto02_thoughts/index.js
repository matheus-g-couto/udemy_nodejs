const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const port = 3000
const conn = require('./db/conn')

// Models
const Thought = require('./models/Thought')
const User = require('./models/User')

// Import routers
const thoughtRoutes = require('./routes/thoughtRoutes')
const authRoutes = require('./routes/authRoutes')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.static('public'))

// session middleware
app.use(
    session({
        name: "session",
        secret: "senha12345",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: () => { },
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// flash messages middleware
app.use(flash())

// set current session to res if user already logged in
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

// rotas
app.use('/thoughts', thoughtRoutes)
app.use('/', authRoutes)

app.get('/', require('./controllers/ThoughtController').showAllThoughts)

conn.sync().then(() => {
    app.listen(port, () => {
        console.log(`App executando na porta ${port}`)
    })
}).catch(err => {
    console.log(err)
})