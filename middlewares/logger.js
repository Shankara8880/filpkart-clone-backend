const fs = require("fs")
const { format } = require("date-fns")
const prepend = require("prepend-file")

const logEvent = async ({
    fileName,
    massage
}) => {
    // console.log(fileName, massage)
    try {
        if (!fs.existsSync("./logs")) {
            fs.mkdirSync("./logs")
        }
        await prepend(`./logs/${fileName}`, massage)
    } catch (error) {
        console.log(error)
    }
}
const log = (req, res, next) => {
    const msg = ` ${format(new Date(), "dd-MM-yyy \t HH:mm:ss")}\t${req.method}\t${req.url}\t${req.headers.origin}\n`
    logEvent({
        fileName: "req.log",
        massage: msg
    })
    next()
}

module.exports = {
    log,
    logEvent
}