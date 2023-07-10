console.log(process.argv)
const args = process.argv.slice(2)

args.forEach((arg) => {
    console.log(arg);
    console.log(arg.split('=')[1]);
})