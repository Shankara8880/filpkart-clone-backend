const { getUserOrder, placeOrder, userCancelOrder, deleteAllOrders, orderPayment, verifyPayment } = require("../controllers/orderController")
const { protected } = require("../middlewares/auth")
const router = require("express").Router()

router
    .get("/order-history", protected, getUserOrder)
    .post("/order-placed", protected, placeOrder)
    .put("/order-cancel/:orderId", protected, userCancelOrder)
    .delete("/destroy", protected, deleteAllOrders)
    .post("/payment", orderPayment)
    .post("/payment/verify", protected, verifyPayment)
module.exports = router