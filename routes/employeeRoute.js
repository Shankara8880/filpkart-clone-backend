const { registerEmployee, getAllEmployee, getSingleEmployee, UpdateEmployee, deleteEmployee, destroyEmployee, employeeProfile, adminGetAllUsers, adminUserStatus, adminStat } = require("../controllers/employeeController")

const router = require("express").Router()

router
    .get("/", getAllEmployee)
    .get("/profile/", employeeProfile)
    .get("/detail/:employeeId", getSingleEmployee)
    .post("/register", registerEmployee)
    .put("/update/:employeeId", UpdateEmployee)
    .delete("/delete/:employeeId", deleteEmployee)
    .delete("/destroy", destroyEmployee)
    // .post("/login", loginEmployee)

    // users
    .get("/users", adminGetAllUsers)
    .get("/stat", adminStat)
    .put("/users/status/:userId", adminUserStatus)
module.exports = router
