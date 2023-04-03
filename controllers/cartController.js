
const asyncHandler = require("express-async-handler")
const Cart = require("../models/Cart")
const Product = require("../models/Product")

exports.addToCart = asyncHandler(async (req, res) => {
    const { userId, qty, productId } = req.body
    if (!qty || !productId) {
        return res.status(400).json({
            message: "All Feild Required"
        })
    }

    const result = await Product.findById(productId)
    console.log("result", result);
    if (result.stock < qty) {
        return res.status(400).json({
            message: "Please Provide Valid QTY"
        })
    }
    const cartItems = await Cart.findOne({ userId })
    if (cartItems) {
        const index = cartItems.products.findIndex(p => p.productId.toString() === req.body.productId)
        console.log(index)
        if (index >= 0) {
            // set qty
            cartItems.products[index].qty = req.body.qty
        } else {
            // push item on exitsting cart
            cartItems.products.push(req.body)
        }
        const result = await Cart.findByIdAndUpdate(cartItems._id, cartItems, { new: true })
        // console.log(result);
        res.json({
            message: "Cart Update SuccessFully",
            // result
        })
    } else {
        const cartItem = {
            userId,
            products: [req.body]
        }
        const result = await Cart.create(cartItem)
        console.log(result);
        res.json({
            message: "Product Added To Cart SuccessFully",
            result
        })
    }
})
exports.getCartData = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const result = await Cart.findOne({ userId: userId })
        .populate("products.productId", "-createdAt -updatedAt -__v -employeeId -_id")
        // .populate("products.productId", "name price brand image category desc ")
        .select("-createdAt -updatedAt -__v -_id -userId")
        .lean()
    if (!result) {
        return res.json({
            message: "Cart Is Empty",
            result: []
        })
    }
    const formatedItems = result.products.map(p => {
        return {
            ...p.productId,
            qty: p.qty
        }
    })
    res.json({
        message: "Fetch from Cart SuccessFully",
        result: formatedItems
    })
})

exports.deleteAllCartData = asyncHandler(async (req, res) => {
    const result = await Cart.deleteMany()
    res.json({
        message: "All Cart Products Deleted SuccessFully",
        // result
    })
})
exports.removeSingleCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { userId } = req.body
    const result = await Cart.findOne({ userId })
    const index = result.products.findIndex(item => item.productId.toString() === productId)
    result.products.splice(index, 1)
    const x = await Cart.findByIdAndUpdate(result._id, result, { new: true })
    res.json({
        message: "Single Cart Products Deleted SuccessFully",
        x
    })
})

exports.emptyCart = asyncHandler(async (req, res) => {

    const { userId } = req.body
    const result = await Cart.deleteOne({ userId })
    res.json({
        message: "Remove SuccessFully",
        result
    })
})

