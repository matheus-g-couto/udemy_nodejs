const chalk = require('chalk')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))

const nota = args['nota']

if (nota >= 8) {
    console.log(chalk.green("Muito bem!"))
} else if (nota >= 6) {
    console.log(chalk.yellow("Estude mais!"))
} else {
    console.log(chalk.bgRed("Você foi reprovado"))
}
