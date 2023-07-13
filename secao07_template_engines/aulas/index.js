const express = require('express')
const exphbs = require('express-handlebars')

const port = 3000

const app = express()

const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/dashboard', (req, res) => {

    const itens = ["Item 1", "Item 2", "Item 3"]

    res.render('dashboard', { itens })
})

app.get('/post', (req, res) => {
    const post = {
        title: "Aprender Node.js",
        category: "JavaScript",
        body: "Este artigo vai te ensinar o básico sobre Node.js...",
        comments: 4
    }

    res.render('blogpost', { post })
})

app.get('/blog', (req, res) => {
    const posts = [
        {
            title: "Aprender Node.js",
            category: "Node.js",
            body: "Este artigo vai te ensinar o básico sobre Node.js...",
            comments: 4
        },
        {
            title: "Aprender PHP",
            category: "PHP",
            body: "Este artigo vai te ensinar o básico sobre PHP...",
            comments: 1
        },
        {
            title: "Aprender Python",
            category: "Python",
            body: "Este artigo vai te ensinar o básico sobre Python...",
            comments: 5
        },
    ]

    res.render('blog', { posts })
})

app.get('/', (req, res) => {

    const user = {
        name: "Matheus",
        surname: "Guimarães",
        age: 20
    }

    const auth = true
    const approved = false

    res.render('home', { user: user, auth, approved })
})

app.listen(port, () => {
    console.log(`App executando na porta ${port}`)
})