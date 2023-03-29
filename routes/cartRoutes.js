const { addToCart, getCartData, deleteAllCartData, removeSingleCartItem, emptyCart } = require("../controllers/cartController")
const { protected } = require("../middlewares/auth")
const router = require("express").Router()

router
    .post("/add-to-cart", protected, addToCart)
    .get("/cart-history", protected, getCartData)
    .delete("/cart-destroy", protected, deleteAllCartData)
    .delete("/cart-remove-single/:productId", protected, removeSingleCartItem)
    .delete("/empty-cart", protected, emptyCart)
module.exports = router