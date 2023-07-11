const fs = require('fs')

fs.stat('pasta_teste', (err, stats) => {
    if (err) {
        console.log(err)
        return
    }

    console.log(stats)
    console.log('isFile: ' + stats.isFile())
    console.log('isDirectory: ' + stats.isDirectory())
    console.log('isSymbolicLink: ' + stats.isSymbolicLink())
    console.log('ctime: ' + stats.ctime)
    console.log('size: ' + stats.size)
})