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

const produtos = [
    {
        id: 1,
        name: "Notebook",
        price: 2500.00,
        description: "Notebook novinho em folha pra você",
        rating: 4.7,
        imageSrc: "https://www.jpinformaticabh.com.br/wp-content/uploads/2023/04/IMG_3651.jpg"
    },
    {
        id: 2,
        name: "Celular",
        price: 1200.00,
        description: "Celular da nova geração",
        rating: 4.4,
        imageSrc: "https://m.media-amazon.com/images/I/61ObWbZiX5L._AC_UF894,1000_QL80_.jpg"
    },
    {
        id: 3,
        name: "Fone sem fio",
        price: 175.00,
        description: "Fone sem fio pra escutar suas músicas sem preocupação",
        rating: 4.9,
        imageSrc: "https://images-americanas.b2w.io/produtos/3780175695/imagens/fone-de-ouvido-sem-fio-bluetooth-i12-tws-v5-0/3780175695_1_large.jpg"
    },
    {
        id: 4,
        name: "Televisão",
        price: 4750.00,
        description: "Televisão tela plana de 50 polegadas",
        rating: 4.7,
        imageSrc: "https://cdn.grupolance.com.br/batches/72/19721/f4360f46e7375eba196c95a180e61211_thumb.jpg"
    }
]

app.get('/produtos/:id', (req, res) => {
    const prodId = req.params.id

    res.render('produtos', { produto: produtos[prodId - 1] })
})

app.get('/', (req, res) => {
    res.render('home', { produtos })
})

app.listen(port, () => {
    console.log(`App executando na porta ${port}`)
})