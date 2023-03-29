const User = require("./../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../utils/email")
exports.registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body
        if (!name || !email || !password) {
            throw new Error("All fileds required")
        }

        const found = await User.findOne({ email: email })

        if (found) {
            throw new Error("Email Alredy Exist")
        }
        const haspass = await bcrypt.hash(password, 10)


        const result = await User.create({
            name,
            email,
            password: haspass
        })
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY)

        sendEmail({
            sendTo: email,
            sub: "Welcome to MERN E-Commerce",
            msg: "Hello and welcome to our website! We're thrilled to have you here. Please feel free to explore and discover all that we have to offer. If you have any questions or need assistance, don't hesitate to reach out. Thank you for registring with us!"
        })
        res.json({
            message: "User Register Successfully",
            result: {
                id: result._id,
                name,
                // email ,
                token
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}
exports.editUser = async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.userId, req.body)
        console.log(result);
        res.json({
            message: "User Update Successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findByIdAndDelete(id)
        res.json({
            message: "User Delete Successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.find().select("-createdAt -updatedAt -__v")
        res.json({
            message: "User Fetched Successfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}
exports.getSingleUsers = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findOne({ _id: id })
        if (!result) {
            throw new Error("User Not Found")
        }
        res.json({
            message: "User Fetched Successfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}
exports.destroyUsers = async (req, res) => {
    try {
        await User.deleteMany()

        res.json({
            message: " All User Delete Successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}
exports.getUserProfile = async (req, res) => {
    try {
        const result = await User.findOne({ _id: req.body.userId }).select("-password -_id -__v -createdAt -updatedAt")
        if (!result) {
            throw new Error("User Not Found")
        }
        res.json({
            message: "User Profile Fetched Successfully",
            result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile || '',
                house: result.house || '',
                landmark: result.landmark || '',
                city: result.city || '',
                pincode: result.pincode || '',
                state: result.state || '',
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error,
        })
    }
}