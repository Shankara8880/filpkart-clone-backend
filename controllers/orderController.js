
const Product = require("../models/Product")
const Order = require("../models/Order")
const asyncHandler = require("express-async-handler")
const Cart = require("../models/Cart")
const Razorpay = require("razorpay")
const { v4: uuid } = require("uuid")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const User = require("./../models/User")
const { orderRecipt } = require("../utils/emailTemplates")
const { format } = require("date-fns")

exports.placeOrder = asyncHandler(async (req, res) => {
    const { userId, type } = req.body
    if (!type) {
        return res.status(400).json({
            message: "Please Provide Type"
        })
    }
    let productArray
    if (type === "buynow") {
        const result = await Product.findById(req.body.productId)
        if (result.stock < req.body.qty) {
            return res.status(400).json({
                message: "Qty is Too Large"
            })
        }
        productArray = [{
            productId: req.body.productId,
            qty: req.body.qty


        }] // for storing the data in db
        await Product.findByIdAndUpdate(req.body.productId, { $inc: { stock: -req.body.qty } })
    } else {
        const cartItems = await Cart.findOne({ userId })
        await Cart.deleteOne({ userId })
        productArray = cartItems.products
        // reduce stock loop

        cartItems.products.forEach(async item => {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } })
        })
    }
    const result = await Order.create({
        userId,
        products: productArray,
        paymentMode: "cod"
    })      // for storing the data in db


    // reduce stock

    res.json({
        message: "Order Placed SuccessFully",
        result
    })
})
exports.getUserOrder = asyncHandler(async (req, res) => {
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    const result = await Order
        .find({ userId: req.body.userId })
        // .populate("userId")
        .populate("products.productId")
        .select(" -createAt -updateAt -_v")
    // .populate({
    //     path: "products",
    //     populate: {
    //         path: "productId",
    //         model: "product"
    //     }
    // })
    console.log(result);
    res.json({
        message: "User Order fetched SuccessFully",
        count: result.length,
        result
    })
})
exports.userCancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Order.findByIdAndUpdate(orderId, {
        orderStatus: "cancle"
    })
    res.json({
        message: "Order Canceled SuccessFully",
        result
    })
})

exports.deleteAllOrders = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Order.deleteMany()
    res.json({
        message: "destroy order SuccessFully",
        // result
    })
})

exports.orderPayment = asyncHandler(async (req, res) => {
    const { total, cart, type } = req.body
    let err = []
    let result
    if (type === "cart") {
        cart.forEach(async (item, i) => {
            result = await Product.findById(item._id)
            // console.log(result);
            if (result.stock < item.qty) {
                err.push({
                    id: item._id,
                    message: "qty missmatch"
                })
            }
            if (i === cart.length - 1) {
                if (err.length > 0) {
                    return res.status(400).json({
                        message: "qty is Too Large",
                        err
                    })
                } else {
                    const instanse = new Razorpay({
                        key_id: process.env.RAZORPAY_KEY,
                        key_secret: process.env.RAZORPAY_SECRET
                    })
                    instanse.orders.create({
                        amount: req.body.total * 100,
                        currency: "INR",
                        receipt: uuid()
                    }, (err, order) => {
                        if (err) {
                            return res.status(400).json({
                                message: "Order Fail " + err
                            })
                        }
                        res.json({
                            message: "Payment Initiated",
                            order
                        })
                    })
                }
            }
        })
    }





})

exports.verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const key = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSignature = crypto
        .createHmac("sha256", `${process.env.RAZORPAY_SECRET}`)
        .update(key.toString())
        .digest("hex")

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            message: "Invalid Payment, Signature mismatch"
        })
    }
    const { userId, type } = req.body
    if (!type) {
        return res.status(400).json({
            message: "Please Provide Type"
        })
    }

    const user = await User.findOne({ _id: userId })
    let cartItems, result, productDetails, formatedItems, total
    if (type === "cart") {
        cartItems = await Cart.findOne({ userId })

        productDetails = await Cart
            .findOne({ userId: userId })
            .populate("products.productId", "name price brand image category desc ")
            .select(" -createdAt -updatedAt -__v -_id -userId")
            .lean()
        formatedItems = productDetails.products.map(p => {
            return {
                ...p.productId,
                qty: p.qty
            }
        })
        total = formatedItems.reduce((sum, i) => sum + (i.price * i.qty), 0)
        await Cart.deleteOne({ userId })

    } else if (type === "buynow") {
        cartItems = {
            products: [{
                productId: req.body.productId,
                qty: req.body.qty
            }]
        }
        const p = await Product.findOne({ _id: req.body.productId })
        total = p.price * p.qty

        formatedItems = [{
            name: p.name,
            price: p.price,
            qty: req.body.qty
        }]
    }

    result = await Order.create({
        userId,
        products: cartItems.products,
        paymentMode: "online",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentSignature: razorpay_signature,
        paymentStatus: "paid"
    })
    sendEmail({
        sendTo: user.email,
        sub: "Order placed Successfully",
        htmlMsg: orderRecipt({
            userName: user.name,
            date: format(Date.now(), "dd-MM-yyyy"),
            orderId: result._id,
            products: formatedItems,
            total,

        }),
        msg: `
        Thank You for your order \n
        Order Id :${result.orderId} \n
        Payment Status : Paid \n
        Payment Mode : Online \n
        Payment Id :${result.paymentId}`
    })

    res.json({
        message: "Payment Success"
    })
})