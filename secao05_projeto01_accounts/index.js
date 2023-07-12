const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')

menu()

function menu() {
    const options = {
        "Criar conta": () => createAccount(),
        "Consultar saldo": () => getBalance(),
        "Depositar": () => deposit(),
        "Sacar": () => withdraw(),
        "Sair": () => stop(),
    }

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: "O que você deseja fazer?",
            choices: Object.keys(options)
        }
    ]).then(answer => {
        const action = answer['action']
        options[action]()
    }).catch(err => {
        console.log(err)
    })
}

function createAccount() {
    console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"))
    console.log(chalk.green("Defina as opções da sua conta a seguir"))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Digite um nome para a sua conta"
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("Esta conta já existe, escolha outro nome!"))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', err => {
            console.log(err)
        })

        console.log(chalk.green(`Parabéns, a sua conta '${accountName}' foi criada com sucesso!`))
        menu()
    }).catch(err => {
        console.log(err);
    })
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("Esta conta não existe!"))
        return false
    }

    return true
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

function getBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Qual o nome da sua conta?"
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return getBalance()
        }

        const accountInfo = getAccount(accountName)
        console.log(chalk.blue(`A conta '${accountName}' tem $${accountInfo.balance}`))

        menu()
    }).catch(err => {
        console.log(err);
    })
}

function updateAccountBalance(accountName, amount) {
    const accountInfo = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde"))
        return
    }

    if (amount < 0 && -amount > accountInfo.balance) {
        console.log(chalk.red.bold("Saldo indisponível!"))
        return
    }

    accountInfo.balance += amount
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountInfo), err => console.log(err))

    if (amount > 0) {
        console.log(chalk.green(`Depósito de $${amount} realizado com sucesso na conta '${accountName}'!`))
    } else {
        console.log(chalk.yellow(`Saque de -$${-amount} realizado com sucesso na conta '${accountName}'!`))
    }
}

function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Qual o nome da conta para realizar o depósito?"
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: "Quanto você deseja depositar?"
            }
        ]).then(answer2 => {
            updateAccountBalance(accountName, parseFloat(answer2['amount']))
            menu()
        }).catch(err2 => {
            console.log(err2);
        })
    }).catch(err => {
        console.log(err);
    })
}

function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Qual o nome da conta para realizar o saque?"
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: "Quanto você deseja sacar?"
            }
        ]).then(answer2 => {
            updateAccountBalance(accountName, -parseFloat(answer2['amount']))
            menu()
        }).catch(err2 => {
            console.log(err2);
        })
    }).catch(err => {
        console.log(err);
    })
}

function stop() {
    console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"))
    process.exit()
}