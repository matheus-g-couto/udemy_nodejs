const http = require('http')
const fs = require('fs')
const url = require('url')

const port = 3000

const server = http.createServer((req, res) => {
    const urlInfo = url.parse(req.url, true)

    const name = urlInfo.query.name
    const age = urlInfo.query.age

    if (!name || !age) {
        fs.readFile('index.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(data)
            return res.end()
        })
    } else {
        fs.appendFile('arquivo.txt', `${name} tem ${age} anos\r\n`, (err, data) => {
            res.writeHead(302, {
                Location: '/'
            })
            return res.end()
        })
    }

})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})