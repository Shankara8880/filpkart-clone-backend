const Employee = require("./../models/Employee")
const asyncHandeler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/email")
const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")

exports.registerEmployee = asyncHandeler(async (req, res) => {

    const { name, password, email } = req.body
    if (!name || !password || !email) {
        return res.status(400).json({
            message: "All Felids Required"
        })
    }

    const dublicate = await Employee.findOne({ email })
    if (dublicate) {
        return res.status(400).json({
            message: "email alredy exist"
        })
    }
    const hashPass = bcrypt.hashSync(password, 10)

    const result = await Employee.create({
        ...req.body,
        password: hashPass,
        role: "intern"
    })

    sendEmail({
        sendTo: email,
        sub: "Welcome to SKILLHUB Team",
        msg: "Hello and welcome to our website! We're thrilled to have you here. Please feel free to explore and discover all that we have to offer. If you have any questions or need assistance, don't hesitate to reach out. Thank you for registring with us!"
    })
    res.json({
        message: "Employee Create SuccessFully",
        result
    })
})

exports.getAllEmployee = asyncHandeler(async (req, res) => {
    const result = await Employee.find()
    res.json({
        message: "All Employee Fetch success",
        result: {
            count: result.length,
            data: result
        }
    })

})

exports.getSingleEmployee = asyncHandeler(async (req, res) => {
    const { employeeId } = req.params

    const result = await Employee.findById(employeeId)
    if (!result) {
        return res.status(401).json({
            message: "Invalid User ID"
        })

    }
    res.json({
        message: "Single Employee Fetch success",
        result
    })

})

exports.UpdateEmployee = asyncHandeler(async (req, res) => {
    const { employeeId } = req.params

    const result = await Employee.findById(employeeId)
    if (!result) {
        return res.status(401).json({
            message: "Invalid User ID"
        })

    }
    const { password, email } = req.body
    if (password) {
        return res.status(400).json({
            message: "Can Not Change Password"
        })
    }

    if (email) {
        const duplicate = await Employee.findOne({ email })
        if (duplicate) {
            return res.status(400).json({
                message: "duplicate Email"
            })
        }

    }

    await Employee.findByIdAndUpdate(employeeId, req.body)

    res.json({
        message: "Employee Update success",
    })

})

exports.deleteEmployee = asyncHandeler(async (req, res) => {
    const { employeeId } = req.params

    const result = await Employee.findOne({ _id: employeeId })
    if (!result) {
        return res.status(400).json({
            message: "Invalid Id"
        })
    }
    await Employee.findByIdAndDelete(employeeId)


    res.json({
        message: "Employee Delete success",
    })

})


exports.destroyEmployee = asyncHandeler(async (req, res) => {

    await Employee.deleteMany()
    res.json({
        message: " All Employee Delete success",
    })

})
exports.employeeProfile = asyncHandeler(async (req, res) => {
    const { employeeId } = req.body
    const result = await Employee.findOne({ _id: employeeId }).select("-createdAt -__v -updatedAt -password")
    // console.log(req.cookies);
    res.json({
        message: " Employee Profile success",
        result
    })

})

// users
exports.adminGetAllUsers = asyncHandeler(async (req, res) => {
    const result = await User.find().select("-createdAt -__v -updatedAt -password")
    // console.log(req.cookies);
    res.json({
        message: " All User Fetched success",
        result
    })

})

exports.adminUserStatus = asyncHandeler(async (req, res) => {
    const { userId } = req.params
    const result = await User.findByIdAndUpdate(userId, {
        active: req.body.active
    })
    // console.log(req.cookies);
    res.json({
        message: `User ${req.body.active ? "Un Blocked" : "Block"} Success`,
    })

})
exports.adminStat = asyncHandeler(async (req, res) => {

    const users = await User.countDocuments()
    const activeUsers = await User.countDocuments({ active: true })
    const inActiveUsers = await User.countDocuments({ active: false })
    const products = await Product.countDocuments()
    const publishProducts = await Product.countDocuments({ publish: true })
    const unPublishProducts = await Product.countDocuments({ publish: false })
    const orders = await Order.countDocuments()
    const deliceredOrders = await Order.countDocuments({ orderStatus: "delivered" })
    const cancleOrders = await Order.countDocuments({ orderStatus: "cancle" })
    const paidOrders = await Order.countDocuments({ paymentStatus: "paid" })
    const codOrders = await Order.countDocuments({ paymentMode: "cod" })
    const onlineOrders = await Order.countDocuments({ paymentMode: "online" })
    res.json({
        message: `Admin Stat Fetch success`,
        result: {
            users,
            activeUsers,
            inActiveUsers,
            products,
            publishProducts,
            unPublishProducts,
            orders,
            deliceredOrders,
            paidOrders,
            codOrders,
            onlineOrders,
            cancleOrders
        }
    })

})







