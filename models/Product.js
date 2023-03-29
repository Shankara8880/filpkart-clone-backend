const mongoose = require("mongoose")

const productShema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["cloths", "electronics", "gadgets", "footware"]
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    employeeId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "employee"
    },
    publish: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("product", productShema)