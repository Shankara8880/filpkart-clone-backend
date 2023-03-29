const jwt = require("jsonwebtoken")
const Employee = require("./../models/Employee")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")



exports.adminProtected = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token
    // console.log("adminprotected", req.body);
    if (!token) {
        return res.status(401).json({
            message: "Please Provide Token"
        })
    }
    // const { id } = jwt.verify(token, process.env.JWT_KEY)
    const [, tk] = token.split(" ")
    const { id } = jwt.verify(tk, process.env.JWT_KEY)
    if (!id) {
        return res.json({
            message: "Invalid token"
        })
    }
    const result = await Employee.findById(id)
    if (!result) {
        return res.status(401).json({
            message: "Can Not find this user"
        })
    }
    if (result.role !== "admin") {
        return res.status(401).json({
            message: "Admin Only Route , Please get In touch With admin"
        })
    }
    req.body.employeeId = id
    next()
})
exports.protected = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({
            message: "Please Provid Token"
        })
    }
    //in token we have "Bearer 5vsvge5njksd" that why we split it and then we need 1St index value as token
    //  [Bearer, tk] = token.split(" ")   
    const [, tk] = token.split(" ")
    const { id } = jwt.verify(tk, process.env.JWT_KEY)
    if (!id) {
        return res.status(400).json({
            message: "INVALID TOKEN"
        })
    }
    const result = await User.findById(id)
    if (!result.active) {
        return res.status(401).json({
            message: "Acount is bloack by Admin. Get in touch with Admin"
        })
    }
    req.body.userId = id
    next()
})