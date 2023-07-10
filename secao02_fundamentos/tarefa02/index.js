const inquirer = require('inquirer')
const chalk = require('chalk')

inquirer.prompt([
    {
        name: 'nome',
        message: "Qual o seu nome?"
    },
    {
        name: 'idade',
        message: "Quantos anos você tem?"
    }
]).then(answers => {
    const nome = answers['nome']
    const idade = answers['idade']

    if (!nome || !idade) {
        throw new Error("É obrigatório inserir o nome e a idade")
    }

    console.log(chalk.bgYellow.black(`${nome} tem ${idade} anos!`))
}).catch(error => {
    console.log(error)
})
