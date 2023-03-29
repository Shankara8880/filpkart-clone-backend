const { getAllUsers, getSingleUsers, editUser, deleteUser, destroyUsers, registerUser, getUserProfile } = require("../controllers/userController")
const { protected, adminProtected } = require("../middlewares/auth")
const router = require("express").Router()

router
    .get("/", adminProtected, getAllUsers)
    .get("/profile", protected, getUserProfile)
    .post("/register", registerUser)
    .delete("/destroy", destroyUsers)
    .put("/profile-update", protected, editUser)
    .delete("/delete/:id", deleteUser)
    .get("/:id", getSingleUsers)


module.exports = router
