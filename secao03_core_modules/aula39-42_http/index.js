const http = require('http')
const port = 3000

const server = http.createServer((req, res) => {
    /* 
        RETORNANDO TEXTO SIMPLES
        res.write('Hello HTTP')
        res.end()
    */
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    res.end("<h1 style='color: red'>Ola, esse eh meu primeiro server com HTML!</h1>")
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})