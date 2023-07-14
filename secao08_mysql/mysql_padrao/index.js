const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const port = 3000

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/books/insert', (req, res) => {
    const title = req.body.title
    const pageQtd = req.body.qtd

    // PREPARAÇÃO DE QUERY
    const sql = "INSERT INTO books (??, ??) VALUES (?, ?)"
    const data = ['title', 'pageqtd', title, pageQtd]

    conn.query(sql, data, err => {
        if (err) {
            console.log(err)
            return
        }

        console.log("Sucesso ao adicionar!")

        res.redirect('/books')
    })
})

app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books"

    conn.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        const books = data

        res.render('books', { books })
    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        const book = data[0]

        res.render('book', { book })
    })
})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        const book = data[0]

        res.render('edit', { book })
    })
})

app.post('/books/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pageQtd = req.body.qtd

    const sql = `UPDATE books SET title = '${title}', pageqtd = '${pageQtd}' WHERE id = '${id}'`

    conn.query(sql, err => {
        if (err) {
            console.log(err)
            return
        }

        res.redirect(`/books/${id}`)
    })
})

app.post('/books/delete/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE id = ${id}`

    conn.query(sql, err => {
        if (err) {
            console.log(err)
            return
        }

        console.log("Sucesso ao excluir!")

        res.redirect('/books')
    })
})

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
})

conn.connect(err => {
    if (err) {
        console.log(err)
    }

    console.log("Conexão ao MySQL com sucesso!")

    app.listen(port, () => {
        console.log(`App executando na porta ${port}`)
    })
})