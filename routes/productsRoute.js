const { addProduct, getAllProduct, getSingleProduct, deleteProduct, destroyProduct, UpdateProductImages, UpdateProductdata, getAllEmployeeProduct } = require("../controllers/productController")
const { adminProtected } = require("../middlewares/auth")

const router = require("express").Router()

router
    .get("/", getAllProduct)
    .get("/employee-products", adminProtected, getAllEmployeeProduct)
    .get("/detail/:ProductId", getSingleProduct)
    .post("/add-product", adminProtected, addProduct)
    .delete("/delete/:ProductId", adminProtected, deleteProduct)
    .delete("/destroy", destroyProduct)
    .put("/Update-product-image/:ProductId", adminProtected, UpdateProductImages)
    .put("/Update-product/:ProductId", adminProtected, UpdateProductdata)

module.exports = router 