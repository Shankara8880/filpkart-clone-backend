const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email_verify: {
        type: Boolean,
    },
    mobile: {
        type: String,
    },
    mobile_verify: {
        type: Boolean
    },
    password: {
        type: String,
        required: true
    },
    house: {
        type: String,
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    state: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)