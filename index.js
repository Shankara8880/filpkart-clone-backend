const express = require("express")
require("dotenv").config({ path: "./.env" })
const cors = require("cors")
const connectDB = require("./config/db")
const { log, logEvent } = require("./middlewares/logger")
const mongoose = require("mongoose")
const { format } = require("date-fns")
const { errorHandler } = require("./middlewares/error")
const path = require('path')
const app = express()
connectDB()

app.use(express.json())
const cookieParser = require("cookie-parser")
const { adminProtected } = require("./middlewares/auth")
app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "public")))
app.use(log)

app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: (o, cb) => {
        allowed = [
            "http://localhost:5000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://localhost:5173",
            "https://railway-filpkart-clone-production.up.railway.app"
        ]
        if (allowed.indexOf(o) !== -1 || !o) {
            cb(null, true)
        } else {
            cb("Block by cors")
        }
    }
}))
app.use("/api/user", require("./routes/userRouters"))
app.use("/api/cart", require("./routes/cartRoutes"))
app.use("/api/order", require("./routes/orderRoutes"))
app.use("/api/employee", adminProtected, require("./routes/employeeRoute"))
app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/products", require("./routes/productsRoute"))

app.use("*", (req, res) => {
    res.status(404).json({
        message: " 404 : Resource You Are Looking For Is Not Awailable"
    })
})
app.use(errorHandler)
const PORT = process.env.PORT || 5000

mongoose.connection.once("open", () => {
    app.listen(PORT, console.log(`SERVER RUNNING http://localhost:${PORT}`))
    console.log("MONGO CONNECTED");
})

mongoose.connection.on("error", err => {
    const msg = `${format(new Date(), "dd-MM-yyyy \t HH:mm:ss")}\t${err.code}\t${err.name}`
    logEvent({
        fileName: "mongo.log",
        message: msg

    })
})