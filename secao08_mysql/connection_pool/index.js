const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

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

    const sql = `INSERT INTO books (title, pageqtd) VALUES ('${title}', '${pageQtd}')`

    pool.query(sql, err => {
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

    pool.query(sql, (err, data) => {
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

    pool.query(sql, (err, data) => {
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

    pool.query(sql, (err, data) => {
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

    pool.query(sql, err => {
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

    pool.query(sql, err => {
        if (err) {
            console.log(err)
            return
        }

        console.log("Sucesso ao excluir!")

        res.redirect('/books')
    })
})

app.listen(port, () => {
    console.log(`App executando na porta ${port}`)
})