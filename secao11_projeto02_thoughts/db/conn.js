const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('projeto02_thoughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log("Conexão ao banco estabelecida com sucesso")
} catch (err) {
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize