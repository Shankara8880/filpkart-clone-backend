const Product = require("../models/Product")
const asyncHandeler = require("express-async-handler")
const { productUpload } = require("../utils/upload")
const jwt = require("jsonwebtoken")
const fs = require("fs").promises
const path = require("path")
const URL = require("../utils/config")

exports.addProduct = asyncHandeler(async (req, res) => {
    productUpload(req, res, async err => {
        // const { id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        // req.body.employeeId = id
        const { name, brand, category, desc, price, stock, employeeId } = req.body

        if (!name || !brand || !category || !desc || !price || !stock || !employeeId) {
            return res.status(400).json({
                message: "All Felids Required"
            })
        }

        if (err) {
            return res.status(400).json({
                message: "Multer Error " + err
            })

        }
        const fileNames = []
        for (let i = 0; i < req.files.length; i++) {
            // assets/images/products
            fileNames.push(`${URL}/assets/images/products/${req.files[i].filename}`)
        }

        const result = await Product.create({
            ...req.body,
            image: fileNames
        })
        res.json({
            message: "Product Added SuccessFully",
        })
    })
})

exports.UpdateProductdata = asyncHandeler(async (req, res) => {
    const { ProductId } = req.params
    const singleProduct = await Product.findById(ProductId)
    if (!singleProduct) {
        return res.status(401).json({
            message: "Invalid Product Id"
        })
    }
    productUpload(req, res, async err => {
        if (err) {
            return res.status(401).json({
                message: "Multer Error" + err
            })
        }

        let fileNames = []
        for (let i = 0; i < req.files.length; i++) {
            fileNames.push(`${URL}/assets/images/products/${req.files[i].filename}`)
        }
        if (fileNames.length > 0) {
            for (let i = 0; i < singleProduct.image.length; i++) {
                await fs.unlink(path.join(__dirname, "..", "public",
                    singleProduct.image[i]))
            }
        } else {
            fileNames = singleProduct.image
        }

        const result = await Product.findByIdAndUpdate(ProductId, {
            ...req.body,
            image: fileNames
        }, { new: true })
        res.json({
            message: "Product Updated",
            result
        })
    })
})

exports.getAllProduct = asyncHandeler(async (req, res) => {
    const result = await Product.find({ publish: true }).select("-employId -createdAt -updatedAt -__v")
    res.json({
        message: "All Product Fetch success",
        result: {
            data: result,
            count: result.length
        }
    })

})
exports.getAllEmployeeProduct = asyncHandeler(async (req, res) => {
    const result = await Product.find().select("-employId -createdAt -updatedAt -__v")
    res.json({
        message: "All Employee Product  Fetch success",
        result: {
            data: result,
            count: result.length
        }
    })

})
exports.deleteEmployeeSingleProduct = asyncHandeler(async (req, res) => {
    const { id } = req.params
    const result = await Product.findByIdAndDelete({ _id: id })
    res.json({
        message: "Employee Single Product Deleted success",
    })
})

exports.getSingleProduct = asyncHandeler(async (req, res) => {
    const { ProductId } = req.params

    const result = await Product.findById(ProductId).select("-employId -createdAt -updatedAt -__v")

    if (!result) {
        return res.status(401).json({

            message: "Invalid Product Id , Please check & Provide Valid Id"
        })

    }
    res.json({
        message: `Single product  id with  ${ProductId} Fetch success`,
        result
    })

})


exports.deleteProduct = asyncHandeler(async (req, res) => {
    const { ProductId } = req.params

    const result = await Product.findOne({ _id: ProductId })
    if (!result) {
        return res.status(400).json({
            message: "Invalid Product Id , Please check & Provide Valid Id"
        })
    }
    await Product.findByIdAndDelete(ProductId)
    res.json({
        message: "One Product Delete success",
    })

})

exports.destroyProduct = asyncHandeler(async (req, res) => {

    await Product.deleteMany()
    // await fs.unlink(path.join(__dirname , ".." , "product"))
    res.json({
        message: " All Product Delete success",
    })

})

exports.UpdateProductImages = asyncHandeler(async (req, res) => {
    const { ProductId } = req.params
    const singleProduct = await Product.findById(ProductId)
    if (!singleProduct) {
        return res.status(401).json({
            message: "Invalid Product Id"
        })
    }
    productUpload(req, res, async err => {
        if (err) {
            return res.status(401).json({
                message: "Multer Error" + err
            })
        }
        for (let i = 0; i < singleProduct.images.length; i++) {
            await fs.unlink(path.join(__dirname, "..", "public",
                singleProduct.images[i]))

        }
        const fileNames = []
        for (let i = 0; i < req.files.length; i++) {
            fileNames.push(`assets/images/products/${req.files[i].filename}`)
        }

        const result = await Product.findByIdAndUpdate(ProductId, {
            image: fileNames
        }, { new: true })


    })
    res.json({ message: "okk" })
})
