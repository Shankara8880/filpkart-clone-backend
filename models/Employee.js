const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailverify: {
        type: Boolean,
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    mobile: {
        type: String,
    },
    mobileVerify: {
        type: Boolean
    },
    role: {
        type: String,
        enum: ["intern", "account", "cms", "support", "admin"],
        default: "intern"
    },
    active: {
        type: String,
        default: true
    },
    joiningDate: {
        type: Date
    },
    dob: {
        type: Date,
    },
    salary: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    }
}, { timestamps: true })

module.exports = mongoose.model("employee", employeeSchema)