const rateLimiter = require("express-rate-limit")
const { logEvent } = require("./logger")
const { format } = require("date-fns")


exports.loginLimiter = rateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    message: "To0 many Attemps",
    handler: (req, res, next, option) => {
        const msg = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}\t${req.url}\t${req.method}\t${req.headers.origin}\t so many login attemts /n`
        logEvent(
            {
                massage: msg,
                fileName: "error.log",
            }
        )
        res.status(401).json({
            message: "To Many Attemps , Please retry After 60 seconds"
        })
    }

})