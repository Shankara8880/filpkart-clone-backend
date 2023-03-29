const { loginUser, loginEmployee, continueWithGoogle, forgotPassword, resetPassword } = require("../controllers/authController")
const { loginLimiter } = require("../middlewares/limiter")

const router = require("express").Router()

router
    .post("/user/login", loginLimiter, loginUser)
    .post("/user/login-with-google", loginLimiter, continueWithGoogle)
    .post("/employee/login", loginEmployee)
    .post("/forgot-password", forgotPassword)
    .post("/reset-password", resetPassword)
module.exports = router