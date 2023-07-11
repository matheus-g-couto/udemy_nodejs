const http = require('http')
const url = require('url')

const port = 3000

const server = http.createServer((req, res) => {
    const urlInfo = url.parse(req.url, true)
    console.log(urlInfo)
    const name = urlInfo.query.name

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    if (!name) {
        res.end(
            "<h1 style='color: red'>Preencha o seu nome:</h1><form method='GET'><input type='text' name='name'/><input type='submit' value='Enviar'/>"
        )
    } else {
        res.end(`<h1 style='color: green'>Seja bem vindo ${name}!</h1>`)
    }
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})