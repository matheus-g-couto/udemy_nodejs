const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question("Qual a sua idade? ", (idade) => {
    console.log(`Eu tenho ${idade} anos`)

    readline.close()
})