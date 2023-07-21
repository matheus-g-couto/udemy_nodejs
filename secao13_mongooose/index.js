const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

const port = 3000
const conn = require('./db/conn')

// Import routers
const productRoutes = require('./routes/productRoutes')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.static('public'))

app.use('/products', productRoutes)

app.get('/', require('./controllers/ProductController').showProducts)

app.listen(port, () => {
    console.log(`App executando na porta ${port}`)
})